import { handle } from "../../src/controller/input_controller.js";

describe("handle function", () => {
  it("should throw an error for an invalid request URL", async () => {
    const req = {
      headers: {
        host: "localhost:3000",
      },
      url: "get-route",
    };

    await expect(handle(req)).rejects.toThrow("Invalid request URL");
  });

  it("should throw an error for an invalid route", async () => {
    const req = {
      url: "/api/get-invalid",
    };

    await expect(handle(req)).rejects.toThrow("Invalid route");
  });

  it("should return a valid response for a valid request", async () => {
    const req = {
      headers: {
        host: "localhost:3000",
      },
      url: "/api/get-base",
    };

    const expectedResponse = {
      statusCode: 200,
      body: {
        success: true,
        message: null,
        data: {
          hello: "world",
        },
      },
    };

    const response = await handle(req);
    expect(response).toEqual(expectedResponse);
  });

  it("should return a valid response for a url with a query string", async () => {
    const req = {
      headers: {
        host: "localhost:3000",
      },
      url: "/api/get-league?name=premier-league",
    };

    const expectedResponse = {
      statusCode: 200,
      body: {
        success: true,
        message: null,
        data: {
          hello: "world",
        },
      },
    };

    const response = await handle(req);
    expect(response.statusCode).toEqual(200);
    expect(response.body.success).toEqual(true);
  });

  it("should return a valid response for a url with a search params in url", async () => {
    const req = {
      headers: {
        host: "localhost:3000",
      },
      url: "/api/get-standings/league/79",
    };

    const expectedResponse = {
      statusCode: 200,
      body: {
        success: true,
        message: null,
        data: {
          hello: "world",
        },
      },
    };

    const response = await handle(req);
    expect(response.statusCode).toEqual(200);
    expect(response.body.success).toEqual(true);
  });
});