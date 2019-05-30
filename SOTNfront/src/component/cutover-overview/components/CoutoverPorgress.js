import React from 'react';
import { cutStatus } from '../../business-manage/components/constant';
import '../stylesheets/cutover-progress.scss';

export default function CutoverProgress(props) {
  const { cutContent, proStatus } = props;
  return (
    <div className="cut-progress">
      <div className={proStatus === '开始' ? 'cut-start0' : 'cut-start'}>
        开始
      </div>
      <div className="cut-border clearfix">
        <div className="cut-border1" />
        <div className="cut-border3">ZHZY分析完成</div>
        <div className="cut-border5">
          割接撤销归档
          <div className="cut-border7">EOMS割接完成</div>
          <div className="cut-border9">归档</div>
        </div>
      </div>
      <div className="cut-content clearfix">
        {cutContent.map((item, index) => {
          return (
            <div
              className={`${
                cutStatus[proStatus].name === item ? 'content' : ''
              }`}
              key={index}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div className="border-bottom clearfix">
        <div className="cut-border2">提交申请</div>
        <div className="cut-border4">
          EOMS审批不通过
          <div className="cut-border6">EOMS审批通过</div>
          <div className="cut-border8">ZHZY资源变更完成</div>
        </div>
        <div className="cut-border10" />
      </div>
      <div className={proStatus === '结束' ? 'cut-end0' : 'cut-end'}>结束</div>
    </div>
  );
}
