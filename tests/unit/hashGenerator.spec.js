const hashGenerator = require('../../hashGenerator');

describe('when calling hashGenerator.generate()', () => {
    it('should return a string with it\'s length between hashGenerator.MIN-hashGenerator.MAX', () => {
        var hash = hashGenerator.generate();
        expect(hash.length).toBeGreaterThanOrEqual(hashGenerator.MIN);
        expect(hash.length).toBeLessThanOrEqual(hashGenerator.MAX);
    });
    it('should return only letters and numbers', () => {
        var hash = hashGenerator.generate();
        regex = /[0-9a-zA-Z]+/;
        expect(regex.test(hash)).toBeTruthy();
    });
});
