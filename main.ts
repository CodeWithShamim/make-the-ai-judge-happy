// Writes the entry image to the grader's /output/entry.png: the picture is the entry.png beside this file, copied
// byte for byte, so two runs write identical bytes and the judge sees exactly the image the repository holds.
//
// The gate takes a whole PNG or JPEG of at most 1 MiB and 1024 by 1024 pixels, so the copy checks the file first
// and fails loudly rather than ship something the judge would never be shown.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const MAX_BYTES = 1048576;
const JPEG_SOI = [0xff, 0xd8];
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const source = new URL('./entry.png', import.meta.url);
const bytes = readFileSync(source);

const isPng = PNG_SIGNATURE.every((byte, i) => bytes[i] === byte);
const isJpeg = JPEG_SOI.every((byte, i) => bytes[i] === byte);
if (!isPng && !isJpeg) throw new Error('entry.png is not a PNG or JPEG: the gate would refuse it');
if (bytes.length > MAX_BYTES) throw new Error(`entry.png is ${bytes.length} bytes, over the ${MAX_BYTES} cap`);

copyFileSync(source, join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png'));
