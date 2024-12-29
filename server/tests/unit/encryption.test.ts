import { encryptData, decryptData } from '../../src/utils/encryption';

describe('Encryption and Decryption', () => {
  const testString = 'This is a test string';
  
  it('should encrypt data correctly', () => {
    const encryptedData = encryptData(testString);
    expect(encryptedData).toBeDefined();
    expect(typeof encryptedData).toBe('string');
    expect(encryptedData).not.toBe(testString);
  });

  it('should decrypt data correctly', () => {
    const encryptedData = encryptData(testString);
    const decryptedData = decryptData(encryptedData);
    expect(decryptedData).toBeDefined();
    expect(typeof decryptedData).toBe('string');
    expect(decryptedData).toBe(testString);
  });

  it('should throw an error if encrypted data is tampered', () => {
    const encryptedData = encryptData(testString);
    const tamperedData = encryptedData.slice(0, -3);
    expect(() => decryptData(tamperedData)).toThrow(/^Decryption failed/);
  });
});
