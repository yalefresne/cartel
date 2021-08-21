require("dotenv").config({
  path: ".env.test",
});
const request = require("supertest");
const app = require("../app");
const { db, connect, actions } = require("../src/db");
const { createUser } = require("../src/db/actions");
const { User, Post, Rating } = require("../src/db/models");

// version of API
const VER = process.env.API_VER;
let user;

beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  user = await createUser("TestUser");
  if (user === null) {
    console.error("Failed to create user.");
    throw new Error("Failed to create user.");
  }
});

describe(`ENDPOINT /api/${VER}/posts`, () => {
  test("➕ : POST : create a post", async () => {
    await request(app)
      .post(`/api/${VER}/posts`)
      .send({
        userId: user._id,
        content: "first post",
      })
      .expect(200)
      .then((res) => {
        let data = res.body;
        expect(data.createdAt).toEqual(expect.any(String));
        expect(data.postId).toEqual(expect.any(String));
      });
  });

  test("➕ : GET : get a single post with postId, it has a reply.", async () => {
    let p = await actions.createPost({
      userId: user._id,
      content: "fifth post",
    });
    let r = await actions.createPost({
      userId: user._id,
      content: "reply to fifth post",
      replyId: p._id,
    });
    await request(app)
      .get(`/api/${VER}/posts`)
      .send({
        postId: p._id,
      })
      .expect(200)
      .then((res) => {
        let pl = res.body;
        expect(pl?.data?.post?._id).toBe(String(p._id));
        expect(pl?.data?.replies?.length).toBe(1);
      });
  });

  test("➕ : GET : get all posts", async () => {
    let p1 = await actions.createPost({
      userId: user._id,
      content: "second post",
    });
    let p2 = await actions.createPost({
      userId: user._id,
      replyId: p1._id,
      content: "third post",
    });
    let p3 = await actions.createPost({
      userId: user._id,
      replyId: p1._id,
      content: "fourth post",
    });
    await request(app)
      .get(`/api/${VER}/posts`)
      .expect(200)
      .then((res) => {
        let data = res.body;
        expect(data.data).toEqual(expect.any(Object));
        expect(data.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              userId: String(user._id),
              content: expect.any(String),
              createdAt: expect.anything(),
              updatedAt: expect.anything(),
              dislikes: expect.any(Number),
              images: expect.any(Array),
              likes: expect.any(Number),
              replies: expect.any(Number),
              tags: expect.any(Array),
            }),
            expect.objectContaining({
              userId: String(user._id),
              replyId: String(p1._id),
            }),
            expect.objectContaining({
              userId: String(user._id),
              replyId: String(p1._id),
            }),
          ])
        );
      });
  });

  test("➕ : POST : Replies are sent to an existing post.'replies' count in 'Post' should be updated.", async () => {
    let p = await actions.createPost({
      userId: user._id,
      content: "Post with many replies.",
    });

    let q = await actions.createPost({
      userId: user._id,
      content: "first reply to : 'Post with many replies'",
      replyId: p._id,
    });

    await request(app)
      .get(`/api/${VER}/posts`)
      .send({
        postId: p._id,
      })
      .expect(200)
      .then((res) => {
        let pl = res.body;
        expect(pl?.data?.post?._id).toEqual(String(p._id));
        expect(pl?.data?.replies?.length).toEqual(1);
        expect(pl?.data?.replies).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ _id: String(q._id) }),
          ])
        );
      });

    let r = await actions.createPost({
      userId: user._id,
      content: "second reply to : 'Post with many replies'",
      replyId: p.id,
    });

    await request(app)
      .get(`/api/${VER}/posts`)
      .send({
        postId: p._id,
      })
      .expect(200)
      .then((res) => {
        let pl = res.body;
        expect(pl?.data?.post?._id).toEqual(String(p._id));
        expect(pl?.data?.replies?.length).toEqual(2);
        expect(pl?.data?.replies).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ _id: String(q._id) }),
            expect.objectContaining({ _id: String(r._id) }),
          ])
        );
      });
  });

  test("➖ : GET : get a post with invalid postId. Either the postId is malinformed or post doesn't exist", async () => {
    await request(app)
      .get(`/api/${VER}/posts`)
      .send({
        postId: "611c116dfdbce6f4571c491x",
        // This is an invalid ObjectId which throws CastError
      })
      .expect(400)
      .then((res) => {
        let pl = res.body;
        expect(pl?.error).toEqual(expect.any(String));
        expect(pl?.details).toEqual(expect.any(Object));
      });
    await request(app)
      .get(`/api/${VER}/posts`)
      .send({
        postId: "611c116dfdbce6f4571c491a",
        // This is an valid ObjectId, but it doesnt exist in db.
      })
      .expect(404)
      .then((res) => {
        let pl = res.body;
        expect(pl?.error).toEqual(expect.any(String));
      });
  });

  test("➖ : POST : Reply to a post, that doesn't exist.", async () => {
    await request(app)
      .post(`/api/${VER}/posts`)
      .send({
        replyId: "thisisaninvalidobjectid",
        // This is an invalid ObjectId which throws CastError
        userId: user._id,
        content: "ok",
      })
      .expect(404)
      .then((res) => {
        let pl = res.body;
        expect(pl?.error).toContain("NotFound");
      });
    await request(app)
      .post(`/api/${VER}/posts`)
      .send({
        replyId: "611c116dfdbce6f4571c491a",
        // This is an invalid ObjectId which throws CastError
        userId: String(user._id),
        content: "ok",
      })
      .expect(404)
      .then((res) => {
        let pl = res?.body;
        expect(pl?.error).toContain("NotFound");
      });
  });
});

describe(`ENDPOINT /api/${VER}/rating`, () => {
  //Transitions:
  // like -> dislike -> neutral -> dislike -> like -> neutral -> like
  test("➕ : RATING : create/update a ratings in a post", async () => {
    let p = await actions.createPost({
      userId: user._id,
      content: "rated post",
    });

    await request(app)
      .post(`/api/${VER}/rating`)
      .send({
        userId: user._id,
        postId: p._id,
        rating: true,
      })
      .expect(200)
      .then(async (res) => {
        const data = res.body;
        expect(data?.data).toBe("success");
        const rating = await Rating.findOne({
          userId: user._id,
          postId: p._id,
        }).exec();
        expect(rating).toEqual(expect.anything());
        const updatedPost = await Post.findById(p._id).exec();
        expect(updatedPost.get("likes")).toBe(1);
        expect(updatedPost.get("dislikes")).toBe(0);
      });

    await request(app)
      .post(`/api/${VER}/rating`)
      .send({
        userId: user._id,
        postId: p._id,
        rating: false,
      })
      .expect(200)
      .then(async (res) => {
        const data = res.body;
        expect(data?.data).toBe("success");
        const updatedRating = await Rating.findOne({
          userId: user._id,
          postId: p._id,
        }).exec();
        expect(updatedRating).toEqual(expect.anything());
        const updatedPost = await Post.findById(p._id).exec();
        expect(updatedPost.get("likes")).toBe(0);
        expect(updatedPost.get("dislikes")).toBe(1);
      });

    await request(app)
      .post(`/api/${VER}/rating`)
      .send({
        userId: user._id,
        postId: p._id,
      })
      .expect(200)
      .then(async (res) => {
        const data = res.body;
        expect(data?.data).toBe("success");
        const updatedPost = await Post.findById(p._id).exec();
        const rating = await Rating.findOne({
          userId: user._id,
          postId: p._id,
        }).exec();
        expect(rating).toEqual(expect.anything());
        expect(updatedPost.get("likes")).toBe(0);
        expect(updatedPost.get("dislikes")).toBe(0);
      });

      await request(app)
      .post(`/api/${VER}/rating`)
      .send({
        userId: user._id,
        postId: p._id,
        rating: false,
      })
      .expect(200)
      .then(async (res) => {
        const data = res.body;
        expect(data?.data).toBe("success");
        const updatedPost = await Post.findById(p._id).exec();
        const rating = await Rating.findOne({
          userId: user._id,
          postId: p._id,
        }).exec();
        expect(rating).toEqual(expect.anything());
        expect(updatedPost.get("likes")).toBe(0);
        expect(updatedPost.get("dislikes")).toBe(1);
      });

      await request(app)
      .post(`/api/${VER}/rating`)
      .send({
        userId: user._id,
        postId: p._id,
        rating: true,
      })
      .expect(200)
      .then(async (res) => {
        const data = res.body;
        expect(data?.data).toBe("success");
        const updatedPost = await Post.findById(p._id).exec();
        const rating = await Rating.findOne({
          userId: user._id,
          postId: p._id,
        }).exec();
        expect(rating).toEqual(expect.anything());
        expect(updatedPost.get("likes")).toBe(1);
        expect(updatedPost.get("dislikes")).toBe(0);
      });

      await request(app)
      .post(`/api/${VER}/rating`)
      .send({
        userId: user._id,
        postId: p._id,
      })
      .expect(200)
      .then(async (res) => {
        const data = res.body;
        expect(data?.data).toBe("success");
        const updatedPost = await Post.findById(p._id).exec();
        const rating = await Rating.findOne({
          userId: user._id,
          postId: p._id,
        }).exec();
        expect(rating).toEqual(expect.anything());
        expect(updatedPost.get("likes")).toBe(0);
        expect(updatedPost.get("dislikes")).toBe(0);
      });

      await request(app)
      .post(`/api/${VER}/rating`)
      .send({
        userId: user._id,
        postId: p._id,
        rating: true,
      })
      .expect(200)
      .then(async (res) => {
        const data = res.body;
        expect(data?.data).toBe("success");
        const updatedPost = await Post.findById(p._id).exec();
        const rating = await Rating.findOne({
          userId: user._id,
          postId: p._id,
        }).exec();
        expect(rating).toEqual(expect.anything());
        expect(updatedPost.get("likes")).toBe(1);
        expect(updatedPost.get("dislikes")).toBe(0);
      });
  });
});

afterEach(async () => {
  await db.dropDatabase();
});

afterAll(async () => {
  await db.close();
});
