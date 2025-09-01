import { describe, it, expect } from 'vitest';
import { SELF } from 'cloudflare:test';
describe('Hono API Worker', () => {
    it('should return "Hello Hono!" on GET /', async () => {
        const response = await SELF.fetch('http://example.com/');
        expect(response.status).toBe(200);
        expect(await response.text()).toBe('Hello Hono!');
    });
    it('should return 404 for unknown routes', async () => {
        const response = await SELF.fetch('http://example.com/unknown');
        expect(response.status).toBe(404);
    });
});
