require("dotenv").config({
  path: ".env.test",
});
const request = require("supertest");
const app = require("../app");
const { db, connect, actions } = require("../src/db");
const { Post, Rating, User } = require("../src/db/models");

// version of API
const VER = process.env.API_VER;

beforeEach(async () => {
  await connect();
});

describe(`ENDPOINT /api/${VER}/posts`, () => {
  it("POST: create a post", () => {
    request(app)
      .post(`/api/${VER}/posts`)
      .send({
        userId: "611bc07f8b37992ff365f087",
        content: "first post",
      })
      .expect(200)
      .then((res) => {
        let data = res.body;
        expect(data.createdAt).toEqual(expect.any(String));
        expect(data.postId).toEqual(expect.any(String));
      });
  });

  test("GET: get all posts", async () => {
    const postContent = ["first post", "second post", "third post"];
    let p1 = await actions.createPost({
      userId: "611bc07f8b37992ff365f087",
      content: "second post",
    });
    let p2 = await actions.createPost({
      userId: "611bc07f8b37992ff365f087",
      replyId: p1.id,
      content: "third post",
    });
    let p3 = await actions.createPost({
      userId: "611bc07f8b37992ff365f087",
      replyId: p1.id,
      content: "fourth post",
    });
    await request(app)
      .get(`/api/${VER}/posts`)
      .expect(200)
      .then((res) => {
        let data = res.body;
        expect(data).toEqual(expect.any(Object));
        expect(data.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              userId: "611bc07f8b37992ff365f087",
            }),
            expect.objectContaining({
              userId: "611bc07f8b37992ff365f087",
            }),
            expect.objectContaining({
              userId: "611bc07f8b37992ff365f087",
              replyId: p1.id,
            }),
            expect.objectContaining({
              userId: "611bc07f8b37992ff365f087",
              replyId: p1.id,
            }),
          ])
        );
      });
  });
});

test("GET: get a single post with postId", async () => {
  let p = await actions.createPost({
    userId: "611bc07f8b37992ff365f087",
    content: "fifth post",
  });
  let r = await actions.createPost({
    userId: "611bc07f8b37992ff365f087",
    content: "reply to fifth post",
    replyId: p.id,
  });
  await request(app)
    .get(`/api/${VER}/posts`)
    .send({
      postId: p.id,
    })
    .expect(200)
    .then((res) => {
      let pl = res.body;
      expect(pl?.data?.post?._id).toEqual(p.id);
      expect(pl?.data?.replies).toEqual(expect.any(Array));
      expect(pl?.data?.replies).toEqual(
        expect.arrayContaining([expect.objectContaining({ _id: r.id })])
      );
    });
});

afterAll(async () => {
  await db.dropDatabase();
  await db.close();
});
