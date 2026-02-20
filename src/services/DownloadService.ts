import RNFS from 'react-native-fs';

export const getLocalPath = (trackId: string) => {
  return `${RNFS.DocumentDirectoryPath}/${trackId}.mp3`;
};

/**
 * Returns true only for real remote HTTP/HTTPS URLs (not localhost/Metro bundler).
 */
const isRemoteUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
    return false;
  }
  // Metro dev server URLs are not real remote URLs
  if (
    lower.includes('localhost') ||
    lower.includes('127.0.0.1') ||
    lower.includes('::1')
  ) {
    return false;
  }
  return true;
};

/**
 * Downloads a track to local storage.
 * - For real remote URLs: downloads via HTTP.
 * - For local/bundled assets (Metro URLs, file://, etc.): the audio is already
 *   in the app bundle and always accessible, so we return a special 'bundled'
 *   marker to signal success without needing an actual download.
 * Returns the local file path on success, 'bundled' for local assets, or null on failure.
 */
export const downloadTrack = async (trackId: string, url: string) => {
  try {
    const localPath = getLocalPath(trackId);

    // If already downloaded to disk, return existing path
    const exists = await RNFS.exists(localPath);
    if (exists) {
      console.log('Already downloaded:', trackId);
      return localPath;
    }

    if (!isRemoteUrl(url)) {
      // This is a bundled/local asset — always on device, no download needed.
      console.log('Bundled asset, marking as offline:', trackId);
      return 'bundled';
    }

    console.log('Downloading:', trackId, 'from', url);

    const downloadResult = RNFS.downloadFile({
      fromUrl: url,
      toFile: localPath,
      background: true,
      discretionary: true,
    });

    const result = await downloadResult.promise;

    if (result.statusCode === 200) {
      console.log('Download successful:', trackId);
      return localPath;
    } else {
      console.log('Download failed with status:', trackId, result.statusCode);
      return null;
    }
  } catch (error) {
    console.log('Download error:', trackId, error);
    return null;
  }
};

export const deleteTrackFile = async (trackId: string) => {
  try {
    const localPath = getLocalPath(trackId);
    const exists = await RNFS.exists(localPath);
    if (exists) {
      await RNFS.unlink(localPath);
      console.log('Deleted local file:', trackId);
      return true;
    }
    return false;
  } catch (error) {
    console.log('Delete error:', trackId, error);
    return false;
  }
};

export const checkFileExists = async (trackId: string) => {
  const localPath = getLocalPath(trackId);
  return await RNFS.exists(localPath);
};

export const verifyLocalFile = async (trackId: string) => {
  try {
    const localPath = getLocalPath(trackId);
    const exists = await RNFS.exists(localPath);
    if (exists) {
      return `file://${localPath}`;
    }
  } catch (error) {
    console.log('Error verifying local file:', error);
  }
  return null;
};
