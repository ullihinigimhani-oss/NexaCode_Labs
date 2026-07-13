import { access, mkdir, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const logoDir = path.join(repoRoot, "client", "src", "assets", "logo");
const outputDir = path.join(repoRoot, "brand-assets", "social");
let sharp;

const sources = {
  fullDefault: path.join(logoDir, "nexacode-logo-full.svg"),
  fullLight: path.join(logoDir, "nexacode-logo-light.svg"),
  mark: path.join(logoDir, "nexacode-mark.svg"),
};

const outputs = {
  facebookProfile: path.join(outputDir, "nexacode-facebook-profile.png"),
  transparent: path.join(outputDir, "nexacode-logo-transparent.png"),
  darkBackground: path.join(outputDir, "nexacode-logo-dark-background.png"),
  lightBackground: path.join(outputDir, "nexacode-logo-light-background.png"),
};

const DEEP_NAVY = "#0B1220";
const WHITE = "#FFFFFF";

async function assertFileExists(filePath) {
  try {
    await access(filePath);
  } catch {
    throw new Error(`Required SVG source is missing: ${path.relative(repoRoot, filePath)}`);
  }
}

async function readRequiredSvg(filePath) {
  await assertFileExists(filePath);
  return readFile(filePath, "utf8");
}

async function loadSharp() {
  const fontCacheDir = path.join(os.tmpdir(), "nexacode-fontconfig-cache");
  await mkdir(fontCacheDir, { recursive: true });
  process.env.XDG_CACHE_HOME ??= fontCacheDir;
  process.env.FONTCONFIG_CACHE ??= fontCacheDir;

  const sharpModule = await import("sharp");
  sharp = sharpModule.default;
}

function makeLightMarkSvg(markSvg, lightLogoSvg) {
  if (!lightLogoSvg.includes(`fill="${WHITE}"`)) {
    throw new Error("The approved light logo does not contain the expected white mark colour.");
  }

  const lightMarkSvg = markSvg.replace(`fill="${DEEP_NAVY}"`, `fill="${WHITE}"`);

  if (lightMarkSvg === markSvg) {
    throw new Error("Could not create the light compact mark from the approved mark SVG.");
  }

  return lightMarkSvg;
}

async function renderLogo(svg, width) {
  const { data, info } = await sharp(Buffer.from(svg), { density: 720 })
    .resize({ width, fit: "inside" })
    .png({
      compressionLevel: 6,
      adaptiveFiltering: true,
      force: true,
    })
    .toBuffer({ resolveWithObject: true });

  return { data, width: info.width, height: info.height };
}

async function exportCanvas({ outputPath, canvasWidth, canvasHeight, background, logoSvg, logoWidth }) {
  const logo = await renderLogo(logoSvg, logoWidth);
  const left = Math.round((canvasWidth - logo.width) / 2);
  const top = Math.round((canvasHeight - logo.height) / 2);

  await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background,
    },
  })
    .composite([{ input: logo.data, left, top }])
    .png({
      compressionLevel: 6,
      adaptiveFiltering: true,
      force: true,
    })
    .toFile(outputPath);

  const metadata = await sharp(outputPath).metadata();
  console.log(`${path.relative(repoRoot, outputPath)} - ${metadata.width}x${metadata.height}`);
}

async function main() {
  await loadSharp();

  const [fullDefaultSvg, fullLightSvg, markSvg] = await Promise.all([
    readRequiredSvg(sources.fullDefault),
    readRequiredSvg(sources.fullLight),
    readRequiredSvg(sources.mark),
  ]);

  await mkdir(outputDir, { recursive: true });

  const lightMarkSvg = makeLightMarkSvg(markSvg, fullLightSvg);

  await exportCanvas({
    outputPath: outputs.facebookProfile,
    canvasWidth: 1080,
    canvasHeight: 1080,
    background: DEEP_NAVY,
    logoSvg: lightMarkSvg,
    logoWidth: 640,
  });

  await exportCanvas({
    outputPath: outputs.transparent,
    canvasWidth: 2000,
    canvasHeight: 2000,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    logoSvg: fullDefaultSvg,
    logoWidth: 1840,
  });

  await exportCanvas({
    outputPath: outputs.darkBackground,
    canvasWidth: 1600,
    canvasHeight: 900,
    background: DEEP_NAVY,
    logoSvg: fullLightSvg,
    logoWidth: 1120,
  });

  await exportCanvas({
    outputPath: outputs.lightBackground,
    canvasWidth: 1600,
    canvasHeight: 900,
    background: WHITE,
    logoSvg: fullDefaultSvg,
    logoWidth: 1120,
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
