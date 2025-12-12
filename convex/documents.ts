import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel';

export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (c, args) => {
    const identity = await c.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;
    const exisitingDocuments = await c.db.get(args.id);
    if (!exisitingDocuments) {
      throw new Error("Not Found")
    }
    if (exisitingDocuments.userId !== userId) {
      throw new Error("Unauthorized")
    }
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await c.db.query("documents").withIndex("by_user_parent", (q) => (
        q.eq("userId", userId).eq("parentDocument", documentId)
      )).collect();
      for (const child of children) {
        // We cannot use async await functionality in map and forEach that's why we are using traditional for loop 
        await c.db.patch(child._id, {
          isArchived: true
        })
        await recursiveArchive(child._id);
      }
    }

    const documents = await c.db.patch(args.id, {
      isArchived: true,
    })

    return documents;
  }

})
export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents"))
  },
  handler: async (c, args) => {
    const identity = await c.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;
    const documents = await c.db.query('documents').withIndex("by_user_parent", (q) => q.eq("userId", userId).eq('parentDocument', args.parentDocument))
      .filter((q) => q.eq(q.field("isArchived"), false)).order('desc').collect()

    return documents;
  }
})
export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (c, args) => {
    const identity = await c.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;
    const documents = await c.db.insert("documents", {
      title: args.title,
      parentDocument: args?.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,

    });
    return documents;
  }
});

export const getTrash = query({
  handler: async (c) => {
    const identity = await c.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not Authenticated")
    }
    const userId = identity.subject;

    const documents = await c.db.query("documents").withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true)).order("desc").collect()
    return documents;
  }
})
export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (c, args) => {
    const identity = await c.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not Authenticated")
    }
    const userId = identity.subject
    const exisitingDocuments = await c.db.get(args.id)
    if (!exisitingDocuments) {
      throw new Error("Not Found")
    }
    if (exisitingDocuments.userId !== userId) {
      throw new Error("Unauthorized")
    }
    // recursiveRestore
    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await c.db.query('documents')
        .withIndex("by_user_parent", (q) => q.eq("userId", userId).eq("parentDocument", documentId))
        .collect()
      for (const child of children) {
        await c.db.patch(child._id, {
          isArchived: false
        });
        await recursiveRestore(child._id);
      }
    }
    const options: Partial<Doc<"documents">> = {
      isArchived: false
    }
    if (exisitingDocuments.parentDocument) {
      const parent = await c.db.get(exisitingDocuments.parentDocument)
      if (parent?.isArchived) {
        options.parentDocument = undefined
      }
    }
    const documents = await c.db.patch(args?.id, options)
    recursiveRestore(args?.id)
    return documents
  }
})

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (c, args) => {
    const identity = await c.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;

    const exisitingDocuments = await c.db.get(args.id);
    if (!exisitingDocuments) {
      throw new Error("Not Found");
    }

    if (exisitingDocuments.userId !== userId) {
      throw new Error("Unauthorized")
    }
    const documents = await c.db.delete(args.id)
    return documents;
  }
})



export const getSearch = query({
  handler: async (c) => {
    const identity = await c.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not Authenticated")
    }
    const userId = identity.subject
    const documents = await c.db.query("documents").withIndex("by_user", (q) => q.eq("userId", userId)).filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc").collect()

    return documents
  }
})
