beforeAll(() => {
  global.fetch = jest.fn((url, config) => {
    // Mock responses based on URL
    if (url.includes('/api/user/employees')) {
      // Respond with an empty array of employees or whatever is appropriate for your tests
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    }

    // You can add more conditions for other API endpoints
    // ...

    // Default to rejecting fetch calls that aren't explicitly mocked:
    return Promise.reject(new Error(`Unmocked endpoint: ${url}`));
  });
});

afterEach(() => {
  global.fetch.mockClear();
});

afterAll(() => {
  global.fetch.mockRestore();
});

  