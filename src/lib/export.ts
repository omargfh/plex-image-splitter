import JSZip from 'jszip';

import { EditorState, SplitLine } from '@/store/editor';

import zipMD from '@/constant/zip';

export const exportImages = async (state: EditorState, src: string[]): Blob => {
  // Create a zip file
  const zip = new JSZip();

  for (let i = 0; i < src.length; i++) {
    // Prepare the original image
    const image = new Image();
    const imageBlob = await fetch(src[i]).then((response) => response.blob());
    image.src = URL.createObjectURL(imageBlob);
    await new Promise((resolve) => (image.onload = resolve));

    // Create the file collector
    const files: File[] = [];

    // Create a an array of all necessary splits
    let splits: { x: number; y: number; width: number; height: number }[] = [];
    const supplement = (splits: SplitLine[]) => [
      { position: 0, size: 100 },
      ...splits,
      { position: 100, size: 100 },
    ];
    const [hsplits, vsplits] = [
      supplement(state.horizontalSplit),
      supplement(state.verticalSplit),
    ];
    for (let i = 0; i < hsplits.length - 1; i++) {
      for (let j = 0; j < vsplits.length - 1; j++) {
        const [currHSplit, nextHSplit] = [hsplits[i], hsplits[i + 1]];
        const [currVSplit, nextVSplit] = [vsplits[j], vsplits[j + 1]];
        splits.push({
          x: currVSplit.position,
          y: currHSplit.position,
          width: nextVSplit.position - currVSplit.position,
          height: nextHSplit.position - currHSplit.position,
        });
      }
    }

    // Change splits from percentages to pixels
    splits = splits.map((split) => ({
      x: (split.x * image.width) / 100,
      y: (split.y * image.height) / 100,
      width: (split.width * image.width) / 100,
      height: (split.height * image.height) / 100,
    }));

    // Create a canvas for each split
    splits.forEach((split, index) => {
      const canvas = document.createElement('canvas');
      canvas.width = split.width;
      canvas.height = split.height;
      const context = canvas.getContext('2d');

      // Draw the split on the canvas
      if (context) {
        context.drawImage(
          image,
          split.x,
          split.y,
          split.width,
          split.height,
          0,
          0,
          split.width,
          split.height
        );
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `image-${i}-split-${index}.png`, {
              type: 'image/png',
            });
            files.push(file);
          }
        });
      }
    });

    // Wait for all files to be created
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (files.length === splits.length) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });

    // Add to zip
    const zipFilesLength = Object.keys(zip.files).length;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        zip.file(file.name, reader?.result as ArrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    });

    // Wait for all files to be added to the zip
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (files.length === Object.keys(zip.files).length - zipFilesLength) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });
  }

  // Add a README file
  zip.file('README.md', zipMD);
  const file = await zip.generateAsync({ type: 'blob' });
  return file;
};
