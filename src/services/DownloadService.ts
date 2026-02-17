import RNFS from 'react-native-fs';

export const getLocalPath = (trackId: string) => {
  return `${RNFS.DocumentDirectoryPath}/${trackId}.mp3`;
};

export const downloadTrack = async (trackId: string, url: string) => {
  try {
    const localPath = getLocalPath(trackId);

    const exists = await RNFS.exists(localPath);
    if (exists) {
      console.log('Already downloaded:', trackId);
      return localPath;
    }

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
      console.log('Download failed:', trackId, result.statusCode);
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
