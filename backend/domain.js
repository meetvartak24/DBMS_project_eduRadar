import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { z } from 'zod';
const scrypt = promisify(scryptCallback);
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return salt + ':' + (await scrypt(password, salt, 64)).toString('hex');
}
export async function verifyPassword(password, hash) {
  const [salt, key] = hash.split(':');
  const actual = await scrypt(password, salt, 64);
  const expected = Buffer.from(key, 'hex');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
export const digest = (t) => createHash('sha256').update(t).digest('hex');
const count = z.number().int().min(0).max(10000);
export const recordSchema = z
  .object({
    mse: z.number().min(0).max(30).nullable(),
    ese: z.number().min(0).max(70).nullable(),
    attended: count,
    classes: count,
    assignments: count,
    submitted: count,
    practicals: count,
    completed: count,
  })
  .refine(
    (r) => r.attended <= r.classes && r.submitted <= r.assignments && r.completed <= r.practicals,
    'Completed counts cannot exceed totals',
  );
export function grade(total) {
  return total >= 90
    ? 10
    : total >= 80
      ? 9
      : total >= 70
        ? 8
        : total >= 60
          ? 7
          : total >= 50
            ? 6
            : total >= 40
              ? 5
              : 0;
}
