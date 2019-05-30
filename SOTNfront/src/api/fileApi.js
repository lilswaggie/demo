import { postDownloadAxios } from '../axios/mainAxios';
import {
  download,
  getFileNameByResponseHeaders,
  getFileNameByTime
} from '../util/FileUtils';

// 文件下载类型，对应api/exporter/{type}的type
export const FileDownloadType = {
  SITE: 'site',
  SITE_PROVINCE: 'siteProvince'
};

function downloadFile(type, body) {
  postDownloadAxios(`api/exporter/${type}`, body, ({ headers, data }) => {
    download(
      data,
      getFileNameByResponseHeaders(headers) || getFileNameByTime()
    );
  });
}

export default {
  downloadFile
};
