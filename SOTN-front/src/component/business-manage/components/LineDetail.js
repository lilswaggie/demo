import React from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Progress, DatePicker } from 'antd';

import PropTypes from 'prop-types';
import moment from 'moment';

import AlarmList from './AlarmList';
import ActivityAlarm from './ActivityAlarm';
import FunctionIndex from './FunctionIndex';
import Linechart from '../card/LineEchart.js';
import ListItem from '../../business-fault/LineDetailList';
import Iframe from '../../../container/Iframe';
import ModalDemo from '../../../container/modal';

import { functionIdx } from './constant';
import { getAxios, postMockAxios } from '../../../axios/mainAxios';
import {
  obj2Arr,
  objectMomentLine,
  baseStaticUrl
} from '../../../util/CommonUtils';

import './line-detail.scss';
import './line-detail.scss';

import kaitong from './kaitong-time.svg';

// 模拟数据
const data = {
  resultxml: {
    msg: 'true',
    success: 'true',
    circuit: {
      int_id: '95105040505de0bf7900f4e82bd710c96cb625171',
      zh_label: '中卫-北京100GE5000NP/KA/λ',
      a_transne_id: '6410102012201HWCSANEL6e0ce43bc458f4d6',
      a_transne_id_value: 'ZW-17338-NX中卫云基地-N-HW-EXC-1',
      z_transne_id: '1110102012201HWCSANELf83cc4455eb6bd24',
      z_transne_id_value: 'ZW-17367-BJ北京大白楼-N-HW-EXC-1',
      a_transequiproom_id: '642010103184794956',
      a_transequiproom_value: '宁夏中卫市沙坡头区数据中心一号机楼1204机房',
      z_transequiproom_id: '1120101031506770869',
      z_transequiproom_value:
        '大兴区大白楼二期通信枢纽楼位置点2层传输骨干1机房',
      path: [
        {
          z_ne_id: '1110102012201HWCSANELf83cc4455eb6bd24',
          z_ne_name: 'ZW-17367-BJ北京大白楼-N-HW-EXC-1',
          a_ne_id: '6410102012201HWCSANEL6e0ce43bc458f4d6',
          a_ne_name: 'ZW-17338-NX中卫云基地-N-HW-EXC-1',
          route: [
            [
              {
                a_ne_id: '6410102012201HWCSANEL6e0ce43bc458f4d6',
                a_ne_name: 'ZW-17338-NX中卫云基地-N-HW-EXC-1',
                a_port_id: '6410302012201HWCSAPRT03eb6f9fc0262af6',
                a_port_name:
                  'ZW-17338-NX中卫云基地-N-HW-EXC-1-1-8(TNV4T405 (TNV4T405Q01))-RX1/TX1',
                a_address:
                  '宁夏中卫市沙坡头区凤云路西部云基地中国移动（宁夏）数据中心一号机房楼',
                z_ne_id: '6410102012201HWCSANEL71eb9d5ac5ceaaf8',
                z_port_id: '6410302012201HWCSAPRT01cdecd840f22bfa',
                z_port_name:
                  'ZW-15482-NX中卫云基地-N-HW-OTM-1-1-14(TN97D48 (TN97D4802))-D34',
                z_address:
                  '宁夏中卫市沙坡头区凤云路西部云基地中国移动（宁夏）数据中心一号机房楼',
                z_ne_name: 'ZW-15482-NX中卫云基地-N-HW-OTM-1'
              },
              {
                a_ne_id: '6410102012201HWCSANEL71eb9d5ac5ceaaf8',
                a_ne_name: 'ZW-15482-NX中卫云基地-N-HW-OTM-1',
                a_port_id: '6410302012201HWCSAPRT01cdecd840f22bfa',
                a_port_name:
                  'ZW-15482-NX中卫云基地-N-HW-OTM-1-1-14(TN97D48 (TN97D4802))-D34',
                a_address:
                  '宁夏中卫市沙坡头区凤云路西部云基地中国移动（宁夏）数据中心一号机房楼',
                z_ne_id: '6410102012201HWCSANELaaa9348adb7b613e',
                z_port_id: '6410302012201HWCSAPRT0be2b9d444ab960e',
                z_port_name:
                  'ZW-16148-NX中卫二中心-N-HW-OA-M6335-0-16(TN52DAPXF (TN52DAPXF-014))-T_VO',
                z_address: '中国宁夏中卫市沙坡头区新区移动综合楼',
                z_ne_name: 'ZW-16148-NX中卫二中心-N-HW-OA-M6335'
              },
              {
                a_ne_id: '6410102012201HWCSANELaaa9348adb7b613e',
                a_ne_name: 'ZW-16148-NX中卫二中心-N-HW-OA-M6335',
                a_port_id: '6410302012201HWCSAPRT0be2b9d444ab960e',
                a_port_name:
                  'ZW-16148-NX中卫二中心-N-HW-OA-M6335-0-16(TN52DAPXF (TN52DAPXF-014))-T_VO',
                a_address: '中国宁夏中卫市沙坡头区新区移动综合楼',
                z_ne_id: '6410102012201HWCSANEL733c8487706934d0',
                z_port_id: '6410302012201HWCSAPRT03529a117d71ba6e',
                z_port_name:
                  'ZW-16149-NX中宁石空-N-HW-OA-M6335-0-3(TN52DAPXF (TN52DAPXF-009))-TM1',
                z_address: '中卫市中宁县石空东街085号',
                z_ne_name: 'ZW-16149-NX中宁石空-N-HW-OA-M6335'
              },
              {
                a_ne_id: '6410102012201HWCSANEL733c8487706934d0',
                a_ne_name: 'ZW-16149-NX中宁石空-N-HW-OA-M6335',
                a_port_id: '6410302012201HWCSAPRT03529a117d71ba6e',
                a_port_name:
                  'ZW-16149-NX中宁石空-N-HW-OA-M6335-0-3(TN52DAPXF (TN52DAPXF-009))-TM1',
                a_address: '中卫市中宁县石空东街085号',
                z_ne_id: '6410102012201HWCSANEL17bf8d31de4d49a0',
                z_port_id: '6410302012201HWCSAPRT0b3d3d9f4a55d11e',
                z_port_name:
                  'ZW-16150-NX吴忠滚泉-N-HW-OA-M6335-0-3(TN52DAPXF (TN52DAPXF-013))-RM1',
                z_address: '中国宁夏吴忠市利通区滚泉',
                z_ne_name: 'ZW-16150-NX吴忠滚泉-N-HW-OA-M6335'
              },
              {
                a_ne_id: '6410102012201HWCSANEL17bf8d31de4d49a0',
                a_ne_name: 'ZW-16150-NX吴忠滚泉-N-HW-OA-M6335',
                a_port_id: '6410302012201HWCSAPRT0b3d3d9f4a55d11e',
                a_port_name:
                  'ZW-16150-NX吴忠滚泉-N-HW-OA-M6335-0-3(TN52DAPXF (TN52DAPXF-013))-RM1',
                a_address: '中国宁夏吴忠市利通区滚泉',
                z_ne_id: '6410102012201HWCSANEL49f8e4ac1ae787f1',
                z_port_id: '6410302012201HWCSAPRT02758376da2a49c1',
                z_port_name:
                  'ZW-16151-NX吴忠二中心-N-HW-OA-M6335-0-16(TN52DAPXF (TN52DAPXF-013))-T_VO',
                z_address: '中国宁夏吴忠市利通区板桥乡黄河路移动公司',
                z_ne_name: 'ZW-16151-NX吴忠二中心-N-HW-OA-M6335'
              },
              {
                a_ne_id: '6410102012201HWCSANEL49f8e4ac1ae787f1',
                a_ne_name: 'ZW-16151-NX吴忠二中心-N-HW-OA-M6335',
                a_port_id: '6410302012201HWCSAPRT02758376da2a49c1',
                a_port_name:
                  'ZW-16151-NX吴忠二中心-N-HW-OA-M6335-0-16(TN52DAPXF (TN52DAPXF-013))-T_VO',
                a_address: '中国宁夏吴忠市利通区板桥乡黄河路移动公司',
                z_ne_id: '6410102012201HWCSANEL10ce744ffca725ba',
                z_port_id: '6410302012201HWCSAPRT147247e0efc4d1fa',
                z_port_name:
                  'ZW-16152-NX银川金凤开发区-N-HW-OA-M6335-0-3(TN52DAPXF (TN52DAPXF-013))-TM1',
                z_address: '银川市金凤区伊家渠街与新昌路口区移动公司2号楼',
                z_ne_name: 'ZW-16152-NX银川金凤开发区-N-HW-OA-M6335'
              },
              {
                a_ne_id: '6410102012201HWCSANEL10ce744ffca725ba',
                a_ne_name: 'ZW-16152-NX银川金凤开发区-N-HW-OA-M6335',
                a_port_id: '6410302012201HWCSAPRT147247e0efc4d1fa',
                a_port_name:
                  'ZW-16152-NX银川金凤开发区-N-HW-OA-M6335-0-3(TN52DAPXF (TN52DAPXF-013))-TM1',
                a_address: '银川市金凤区伊家渠街与新昌路口区移动公司2号楼',
                z_ne_id: '6410102012201HWCSANEL59cd285e0c3335b5',
                z_port_id: '6410302012201HWCSAPRT03e44b9ca5262ca6',
                z_port_name:
                  'ZW-16153-NX银川西夏-N-HW-OA-M6335-0-16(TN52DAPXF (TN52DAPXF-014))-RM1',
                z_address:
                  '银川市西夏区文萃南街与经天西路交口西南角开发区生产中心',
                z_ne_name: 'ZW-16153-NX银川西夏-N-HW-OA-M6335'
              },
              {
                a_ne_id: '6410102012201HWCSANEL59cd285e0c3335b5',
                a_ne_name: 'ZW-16153-NX银川西夏-N-HW-OA-M6335',
                a_port_id: '6410302012201HWCSAPRT03e44b9ca5262ca6',
                a_port_name:
                  'ZW-16153-NX银川西夏-N-HW-OA-M6335-0-16(TN52DAPXF (TN52DAPXF-014))-RM1',
                a_address:
                  '银川市西夏区文萃南街与经天西路交口西南角开发区生产中心',
                z_ne_id: '6410102012201HWCSANEL5cb9896350908c5f',
                z_port_id: '6410302012201HWCSAPRT06049b524f592047',
                z_port_name:
                  'ZW-16154-NX灵武紫荆花-N-HW-OA-M6335-0-16(TN52DAPXF (TN52DAPXF-009))-RM2',
                z_address: '银川市灵武市宁东大道与长城路交叉口',
                z_ne_name: 'ZW-16154-NX灵武紫荆花-N-HW-OA-M6335'
              },
              {
                a_ne_id: '6410102012201HWCSANEL5cb9896350908c5f',
                a_ne_name: 'ZW-16154-NX灵武紫荆花-N-HW-OA-M6335',
                a_port_id: '6410302012201HWCSAPRT06049b524f592047',
                a_port_name:
                  'ZW-16154-NX灵武紫荆花-N-HW-OA-M6335-0-16(TN52DAPXF (TN52DAPXF-009))-RM2',
                a_address: '银川市灵武市宁东大道与长城路交叉口',
                z_ne_id: '6410102012201HWCSANEL834edb285263b2b0',
                z_port_id: '6410302012201HWCSAPRT01dcb1fc270ba22d',
                z_port_name:
                  'ZW-16155-NX盐池高沙窝-N-HW-OA-M6335-0-3(TN52DAPXF (TN52DAPXF-014))-T_OUT',
                z_address: '中国宁夏吴忠市盐池县高沙窝',
                z_ne_name: 'ZW-16155-NX盐池高沙窝-N-HW-OA-M6335'
              },
              {
                a_ne_id: '6410102012201HWCSANEL834edb285263b2b0',
                a_ne_name: 'ZW-16155-NX盐池高沙窝-N-HW-OA-M6335',
                a_port_id: '6410302012201HWCSAPRT01dcb1fc270ba22d',
                a_port_name:
                  'ZW-16155-NX盐池高沙窝-N-HW-OA-M6335-0-3(TN52DAPXF (TN52DAPXF-014))-T_OUT',
                a_address: '中国宁夏吴忠市盐池县高沙窝',
                z_ne_id: '6410102012201HWCSANEL0c2fb6dc80e775d3',
                z_port_id: '6410302012201HWCSAPRT0283388d9897fcd7',
                z_port_name:
                  'ZW-16156-NX盐池西门-N-HW-OA-M6335-0-21(TN18EFI (TN18EFIB))-ETH2',
                z_address: '中国宁夏吴忠市盐池县花马池镇盐林北路盐池西门',
                z_ne_name: 'ZW-16156-NX盐池西门-N-HW-OA-M6335'
              },
              {
                a_ne_id: '6410102012201HWCSANEL0c2fb6dc80e775d3',
                a_ne_name: 'ZW-16156-NX盐池西门-N-HW-OA-M6335',
                a_port_id: '6410302012201HWCSAPRT0283388d9897fcd7',
                a_port_name:
                  'ZW-16156-NX盐池西门-N-HW-OA-M6335-0-21(TN18EFI (TN18EFIB))-ETH2',
                a_address: '中国宁夏吴忠市盐池县花马池镇盐林北路盐池西门',
                z_ne_id: '6110102012201HWCSANEL3eb180593bc0fe88',
                z_port_id: '6110302012201HWCSAPRT01f2c97c3164ebe6',
                z_port_name:
                  'ZW-16157-SX定边安边-N-HW-OA-M6335-0-3(TN52DAPXF (TN52DAPXF-007))-T_VO',
                z_address: '榆林定边安边一干',
                z_ne_name: 'ZW-16157-SX定边安边-N-HW-OA-M6335'
              },
              {
                a_ne_id: '6110102012201HWCSANEL3eb180593bc0fe88',
                a_ne_name: 'ZW-16157-SX定边安边-N-HW-OA-M6335',
                a_port_id: '6110302012201HWCSAPRT01f2c97c3164ebe6',
                a_port_name:
                  'ZW-16157-SX定边安边-N-HW-OA-M6335-0-3(TN52DAPXF (TN52DAPXF-007))-T_VO',
                a_address: '榆林定边安边一干',
                z_ne_id: '6110102012201HWCSANEL9282e1fbac96a9b6',
                z_port_id: '6110302012201HWCSAPRT000b0e89c52f8d74',
                z_port_name:
                  'ZW-16158-SX靖边林家湾-N-HW-OTM-1-0-14(TN97D48 (TN97D4801))-D33',
                z_address: '榆林靖边林家湾综合业务站点',
                z_ne_name: 'ZW-16158-SX靖边林家湾-N-HW-OTM-1'
              },
              {
                a_ne_id: '6110102012201HWCSANEL9282e1fbac96a9b6',
                a_ne_name: 'ZW-16158-SX靖边林家湾-N-HW-OTM-1',
                a_port_id: '6110302012201HWCSAPRT000b0e89c52f8d74',
                a_port_name:
                  'ZW-16158-SX靖边林家湾-N-HW-OTM-1-0-14(TN97D48 (TN97D4801))-D33',
                a_address: '榆林靖边林家湾综合业务站点',
                z_ne_id: '6110102012201HWCSANEL4681c7908aa4b2c2',
                z_port_id: '6110302012201HWCSAPRT007fba4dd53cf8e6',
                z_port_name:
                  'ZW-17245-SX靖边林家湾-N-HW-EXC-1-0-15(TNS1N405 (TNS1N405C01))-IN4/OUT4',
                z_address: '榆林靖边林家湾综合业务站点',
                z_ne_name: 'ZW-17245-SX靖边林家湾-N-HW-EXC-1'
              },
              {
                a_ne_id: '6110102012201HWCSANEL4681c7908aa4b2c2',
                a_ne_name: 'ZW-17245-SX靖边林家湾-N-HW-EXC-1',
                a_port_id: '6110302012201HWCSAPRT007fba4dd53cf8e6',
                a_port_name:
                  'ZW-17245-SX靖边林家湾-N-HW-EXC-1-0-15(TNS1N405 (TNS1N405C01))-IN4/OUT4',
                a_address: '榆林靖边林家湾综合业务站点',
                z_ne_id: '6110102012201HWCSANELc08a852b5cbd3a0d',
                z_port_id: '6110302012201HWCSAPRT000e1e3bbc120520',
                z_port_name:
                  'ZW-15970-SX靖边林家湾-N-HW-OTM-2-0-14(TN97D48 (TN97D4801))-D13',
                z_address: '榆林靖边林家湾综合业务站点',
                z_ne_name: 'ZW-15970-SX靖边林家湾-N-HW-OTM-2'
              },
              {
                a_ne_id: '6110102012201HWCSANELc08a852b5cbd3a0d',
                a_ne_name: 'ZW-15970-SX靖边林家湾-N-HW-OTM-2',
                a_port_id: '6110302012201HWCSAPRT000e1e3bbc120520',
                a_port_name:
                  'ZW-15970-SX靖边林家湾-N-HW-OTM-2-0-14(TN97D48 (TN97D4801))-D13',
                a_address: '榆林靖边林家湾综合业务站点',
                z_ne_id: '6110102012201HWCSANEL3800a52f9b2e2a4f',
                z_port_id: '6110302012201HWCSAPRT00073b67a1bc20c3',
                z_port_name:
                  'ZW-15770-SX横山魏家楼-N-HW-OA-M6252-0-16(TN52DAPXF (TN52DAPXF-009))-TM2',
                z_address: '横山魏家楼',
                z_ne_name: 'ZW-15770-SX横山魏家楼-N-HW-OA-M6252'
              },
              {
                a_ne_id: '6110102012201HWCSANEL3800a52f9b2e2a4f',
                a_ne_name: 'ZW-15770-SX横山魏家楼-N-HW-OA-M6252',
                a_port_id: '6110302012201HWCSAPRT00073b67a1bc20c3',
                a_port_name:
                  'ZW-15770-SX横山魏家楼-N-HW-OA-M6252-0-16(TN52DAPXF (TN52DAPXF-009))-TM2',
                a_address: '横山魏家楼',
                z_ne_id: '6110102012201HWCSANEL6b55efaedc0e7e05',
                z_port_id: '6110302012201HWCSAPRT037e7a32451de471',
                z_port_name:
                  'ZW-15771-SX绥德维护中心-N-HW-OA-M6252-0-16(TN52DAPXF (TN52DAPXF-009))-TM2',
                z_address: '',
                z_ne_name: 'ZW-15771-SX绥德维护中心-N-HW-OA-M6252'
              },
              {
                a_ne_id: '6110102012201HWCSANEL6b55efaedc0e7e05',
                a_ne_name: 'ZW-15771-SX绥德维护中心-N-HW-OA-M6252',
                a_port_id: '6110302012201HWCSAPRT037e7a32451de471',
                a_port_name:
                  'ZW-15771-SX绥德维护中心-N-HW-OA-M6252-0-16(TN52DAPXF (TN52DAPXF-009))-TM2',
                a_address: '',
                z_ne_id: '6110102012201HWCSANEL5f961fe2f0cc8d41',
                z_port_id: '6110302012201HWCSAPRT0172e659a303977d',
                z_port_name:
                  'ZW-15772-SX吴堡前庙山-N-HW-OA-M6252-0-4(TN12AST2 (TN12AST2))-TMO1',
                z_address: '吴堡县',
                z_ne_name: 'ZW-15772-SX吴堡前庙山-N-HW-OA-M6252'
              },
              {
                a_ne_id: '6110102012201HWCSANEL5f961fe2f0cc8d41',
                a_ne_name: 'ZW-15772-SX吴堡前庙山-N-HW-OA-M6252',
                a_port_id: '6110302012201HWCSAPRT0172e659a303977d',
                a_port_name:
                  'ZW-15772-SX吴堡前庙山-N-HW-OA-M6252-0-4(TN12AST2 (TN12AST2))-TMO1',
                a_address: '吴堡县',
                z_ne_id: '1410102012201HWCSANEL9c2675da527fc550',
                z_port_id: '1410302012201HWCSAPRT001595c6ff681e9e',
                z_port_name:
                  'ZW-15773-SX离石移动生产楼-N-HW-OTM-1-0-5(TN97M48V (TN97M48V01))-M47',
                z_address:
                  '山西省吕梁离石区滨河街道五一街中国移动通信集团山西有限公司吕梁分公司',
                z_ne_name: 'ZW-15773-SX离石移动生产楼-N-HW-OTM-1'
              },
              {
                a_ne_id: '1410102012201HWCSANEL9c2675da527fc550',
                a_ne_name: 'ZW-15773-SX离石移动生产楼-N-HW-OTM-1',
                a_port_id: '1410302012201HWCSAPRT001595c6ff681e9e',
                a_port_name:
                  'ZW-15773-SX离石移动生产楼-N-HW-OTM-1-0-5(TN97M48V (TN97M48V01))-M47',
                a_address:
                  '山西省吕梁离石区滨河街道五一街中国移动通信集团山西有限公司吕梁分公司',
                z_ne_id: '1410102012201HWCSANELcb693d660ff29af9',
                z_port_id: '1410302012201HWCSAPRT047d40c68146b1a0',
                z_port_name:
                  'ZW-15774-SX中阳吴城右线-N-HW-OA-M6253-0-3(TN52DAPXF (TN52DAPXF-009))-RM1',
                z_address: '山西省吕梁离石区吴城镇街上村街上村',
                z_ne_name: 'ZW-15774-SX中阳吴城右线-N-HW-OA-M6253'
              },
              {
                a_ne_id: '1410102012201HWCSANELcb693d660ff29af9',
                a_ne_name: 'ZW-15774-SX中阳吴城右线-N-HW-OA-M6253',
                a_port_id: '1410302012201HWCSAPRT047d40c68146b1a0',
                a_port_name:
                  'ZW-15774-SX中阳吴城右线-N-HW-OA-M6253-0-3(TN52DAPXF (TN52DAPXF-009))-RM1',
                a_address: '山西省吕梁离石区吴城镇街上村街上村',
                z_ne_id: '1410102012201HWCSANELe948036f1a489542',
                z_port_id: '1410302012201HWCSAPRT01b26c12a61624b1',
                z_port_name:
                  'ZW-15775-SX交城大岩头村-N-HW-OA-M6253-0-3(TN52DAPXF (TN52DAPXF-007))-T_VI',
                z_address: '山西省吕梁交城县西社镇大岩头村大岩头村',
                z_ne_name: 'ZW-15775-SX交城大岩头村-N-HW-OA-M6253'
              },
              {
                a_ne_id: '1410102012201HWCSANELe948036f1a489542',
                a_ne_name: 'ZW-15775-SX交城大岩头村-N-HW-OA-M6253',
                a_port_id: '1410302012201HWCSAPRT01b26c12a61624b1',
                a_port_name:
                  'ZW-15775-SX交城大岩头村-N-HW-OA-M6253-0-3(TN52DAPXF (TN52DAPXF-007))-T_VI',
                a_address: '山西省吕梁交城县西社镇大岩头村大岩头村',
                z_ne_id: '1410102012201HWCSANEL7884dc5b814e3fdd',
                z_port_id: '1410302012201HWCSAPRT00718fc346081b87',
                z_port_name:
                  'ZW-15776-SX清徐县局-N-HW-OA-M6253-0-4(TN12AST2 (TN12AST2))-TMI1',
                z_address: '山西省太原清徐县东湖街道美锦大街清徐自办营业厅',
                z_ne_name: 'ZW-15776-SX清徐县局-N-HW-OA-M6253'
              },
              {
                a_ne_id: '1410102012201HWCSANEL7884dc5b814e3fdd',
                a_ne_name: 'ZW-15776-SX清徐县局-N-HW-OA-M6253',
                a_port_id: '1410302012201HWCSAPRT00718fc346081b87',
                a_port_name:
                  'ZW-15776-SX清徐县局-N-HW-OA-M6253-0-4(TN12AST2 (TN12AST2))-TMI1',
                a_address: '山西省太原清徐县东湖街道美锦大街清徐自办营业厅',
                z_ne_id: '1410102012201HWCSANELe98f399c2acb50cf',
                z_port_id: '1410302012201HWCSAPRT0065b7cfb0cc4d19',
                z_port_name:
                  'ZW-15570-SX太原杏花岭一枢纽-N-HW-OTM-1-3-14(TN97D48 (TN97D4802))-D38',
                z_address: '山西省省公司省杏花岭区杏花岭街道',
                z_ne_name: 'ZW-15570-SX太原杏花岭一枢纽-N-HW-OTM-1'
              },
              {
                a_ne_id: '1410102012201HWCSANELe98f399c2acb50cf',
                a_ne_name: 'ZW-15570-SX太原杏花岭一枢纽-N-HW-OTM-1',
                a_port_id: '1410302012201HWCSAPRT0065b7cfb0cc4d19',
                a_port_name:
                  'ZW-15570-SX太原杏花岭一枢纽-N-HW-OTM-1-3-14(TN97D48 (TN97D4802))-D38',
                a_address: '山西省省公司省杏花岭区杏花岭街道',
                z_ne_id: '1410102012201HWCSANEL08f8a58df5e3e5f5',
                z_port_id: '1410302012201HWCSAPRT00a9805c5561ab50',
                z_port_name:
                  'ZW-17345-SX太原杏花岭一枢纽-N-HW-EXC-1-0-12(TNS1N405 (TNS1N405C01))-IN4/OUT4',
                z_address: '山西省省公司省杏花岭区杏花岭街道',
                z_ne_name: 'ZW-17345-SX太原杏花岭一枢纽-N-HW-EXC-1'
              },
              {
                a_ne_id: '1410102012201HWCSANEL08f8a58df5e3e5f5',
                a_ne_name: 'ZW-17345-SX太原杏花岭一枢纽-N-HW-EXC-1',
                a_port_id: '1410302012201HWCSAPRT00a9805c5561ab50',
                a_port_name:
                  'ZW-17345-SX太原杏花岭一枢纽-N-HW-EXC-1-0-12(TNS1N405 (TNS1N405C01))-IN4/OUT4',
                a_address: '山西省省公司省杏花岭区杏花岭街道',
                z_ne_id: '1410102012201HWCSANEL9fc8aaab7e490559',
                z_port_id: '1410302012201HWCSAPRT00061a961849c03d',
                z_port_name:
                  'ZW-15777-SX太原杏花岭一枢纽-N-HW-OTM-3-3-3(TN97M48V (TN97M48V02))-M44',
                z_address: '山西省省公司省杏花岭区杏花岭街道',
                z_ne_name: 'ZW-15777-SX太原杏花岭一枢纽-N-HW-OTM-3'
              },
              {
                a_ne_id: '1410102012201HWCSANEL9fc8aaab7e490559',
                a_ne_name: 'ZW-15777-SX太原杏花岭一枢纽-N-HW-OTM-3',
                a_port_id: '1410302012201HWCSAPRT00061a961849c03d',
                a_port_name:
                  'ZW-15777-SX太原杏花岭一枢纽-N-HW-OTM-3-3-3(TN97M48V (TN97M48V02))-M44',
                a_address: '山西省省公司省杏花岭区杏花岭街道',
                z_ne_id: '1410102012201HWCSANEL84a099ce0f5eec1a',
                z_port_id: '1410302012201HWCSAPRT053c13fc7633eebc',
                z_port_name:
                  'ZW-15569-SX阳曲县青龙镇-N-HW-OA-M6199-0-3(TN52DAPXF (TN52DAPXF-007))-T_IN',
                z_address: '山西省太原阳曲县侯村乡南塔地村南塔地村',
                z_ne_name: 'ZW-15569-SX阳曲县青龙镇-N-HW-OA-M6199'
              },
              {
                a_ne_id: '1410102012201HWCSANEL84a099ce0f5eec1a',
                a_ne_name: 'ZW-15569-SX阳曲县青龙镇-N-HW-OA-M6199',
                a_port_id: '1410302012201HWCSAPRT053c13fc7633eebc',
                a_port_name:
                  'ZW-15569-SX阳曲县青龙镇-N-HW-OA-M6199-0-3(TN52DAPXF (TN52DAPXF-007))-T_IN',
                a_address: '山西省太原阳曲县侯村乡南塔地村南塔地村',
                z_ne_id: '1410102012201HWCSANELc6c6ec374035a6e7',
                z_port_id: '1410302012201HWCSAPRT0edb065bbfdf3911',
                z_port_name:
                  'ZW-15568-SX忻州生产楼-N-HW-OA-M6199-0-16(TN52DAPXF (TN52DAPXF-007))-RC/TC',
                z_address: '山西省忻州忻府区播明镇汾源街移动公司',
                z_ne_name: 'ZW-15568-SX忻州生产楼-N-HW-OA-M6199'
              },
              {
                a_ne_id: '1410102012201HWCSANELc6c6ec374035a6e7',
                a_ne_name: 'ZW-15568-SX忻州生产楼-N-HW-OA-M6199',
                a_port_id: '1410302012201HWCSAPRT0edb065bbfdf3911',
                a_port_name:
                  'ZW-15568-SX忻州生产楼-N-HW-OA-M6199-0-16(TN52DAPXF (TN52DAPXF-007))-RC/TC',
                a_address: '山西省忻州忻府区播明镇汾源街移动公司',
                z_ne_id: '1410102012201HWCSANEL0a95d85248d747e1',
                z_port_id: '1410302012201HWCSAPRT04c170a192e9d99b',
                z_port_name:
                  'ZW-15567-SX五台高速口-N-HW-OA-M6199-0-3(TN52DAPXF (TN52DAPXF-019))-R_VO',
                z_address: '山西省忻州五台县沟南乡王庄村王庄村',
                z_ne_name: 'ZW-15567-SX五台高速口-N-HW-OA-M6199'
              },
              {
                a_ne_id: '1410102012201HWCSANEL0a95d85248d747e1',
                a_ne_name: 'ZW-15567-SX五台高速口-N-HW-OA-M6199',
                a_port_id: '1410302012201HWCSAPRT04c170a192e9d99b',
                a_port_name:
                  'ZW-15567-SX五台高速口-N-HW-OA-M6199-0-3(TN52DAPXF (TN52DAPXF-019))-R_VO',
                a_address: '山西省忻州五台县沟南乡王庄村王庄村',
                z_ne_id: '1410102012201HWCSANELd344a6921f9d7722',
                z_port_id: '1410302012201HWCSAPRT01e9ab0fc3ab9c38',
                z_port_name:
                  'ZW-15566-SX五台石咀高速口-N-HW-OA-M6199-0-16(TN52DAPXF (TN52DAPXF-009))-RC/TC',
                z_address: '山西省忻州五台县门限石乡化桥村化桥村',
                z_ne_name: 'ZW-15566-SX五台石咀高速口-N-HW-OA-M6199'
              },
              {
                a_ne_id: '1410102012201HWCSANELd344a6921f9d7722',
                a_ne_name: 'ZW-15566-SX五台石咀高速口-N-HW-OA-M6199',
                a_port_id: '1410302012201HWCSAPRT01e9ab0fc3ab9c38',
                a_port_name:
                  'ZW-15566-SX五台石咀高速口-N-HW-OA-M6199-0-16(TN52DAPXF (TN52DAPXF-009))-RC/TC',
                a_address: '山西省忻州五台县门限石乡化桥村化桥村',
                z_ne_id: '1310102012201HWCSANELc11e6d8533c63576',
                z_port_id: '1310302012201HWCSAPRT00e5389ba8285882',
                z_port_name:
                  'ZW-15565-HB阜平幸福村-N-HW-OA-M6199-0-16(TN52DAPXF (TN52DAPXF-009))-R_VI',
                z_address: '保定市阜平县第一山村',
                z_ne_name: 'ZW-15565-HB阜平幸福村-N-HW-OA-M6199'
              },
              {
                a_ne_id: '1310102012201HWCSANELc11e6d8533c63576',
                a_ne_name: 'ZW-15565-HB阜平幸福村-N-HW-OA-M6199',
                a_port_id: '1310302012201HWCSAPRT00e5389ba8285882',
                a_port_name:
                  'ZW-15565-HB阜平幸福村-N-HW-OA-M6199-0-16(TN52DAPXF (TN52DAPXF-009))-R_VI',
                a_address: '保定市阜平县第一山村',
                z_ne_id: '1310102012201HWCSANELc8b568d37b10c5c0',
                z_port_id: '1310302012201HWCSAPRT07e51f6ce9cc91f2',
                z_port_name:
                  'ZW-15564-HB唐县白合镇-N-HW-OA-M6199-0-3(TN52DAPXF (TN52DAPXF-014))-T_MON',
                z_address: '保定市唐县',
                z_ne_name: 'ZW-15564-HB唐县白合镇-N-HW-OA-M6199'
              },
              {
                a_ne_id: '1310102012201HWCSANELc8b568d37b10c5c0',
                a_ne_name: 'ZW-15564-HB唐县白合镇-N-HW-OA-M6199',
                a_port_id: '1310302012201HWCSAPRT07e51f6ce9cc91f2',
                a_port_name:
                  'ZW-15564-HB唐县白合镇-N-HW-OA-M6199-0-3(TN52DAPXF (TN52DAPXF-014))-T_MON',
                a_address: '保定市唐县',
                z_ne_id: '1310102012201HWCSANEL49daabadd3ebf9a3',
                z_port_id: '1310302012201HWCSAPRT004d1b83dca34d4d',
                z_port_name:
                  'ZW-15563-HB满城永安庄-N-HW-OA-M6199-0-3(TN52DAPXF (TN52DAPXF-009))-R_IN',
                z_address: '保定市满城县石井乡永安庄村',
                z_ne_name: 'ZW-15563-HB满城永安庄-N-HW-OA-M6199'
              },
              {
                a_ne_id: '1310102012201HWCSANEL49daabadd3ebf9a3',
                a_ne_name: 'ZW-15563-HB满城永安庄-N-HW-OA-M6199',
                a_port_id: '1310302012201HWCSAPRT004d1b83dca34d4d',
                a_port_name:
                  'ZW-15563-HB满城永安庄-N-HW-OA-M6199-0-3(TN52DAPXF (TN52DAPXF-009))-R_IN',
                a_address: '保定市满城县石井乡永安庄村',
                z_ne_id: '1310102012201HWCSANEL886eec5e565f8581',
                z_port_id: '1310302012201HWCSAPRT16e94d966c09fd39',
                z_port_name:
                  'ZW-15562-HB涞水冀家沟-N-HW-OA-M6199-0-21(TN18EFI (TN18EFIB))-ETH2',
                z_address: '保定市涞水县纪家沟村',
                z_ne_name: 'ZW-15562-HB涞水冀家沟-N-HW-OA-M6199'
              },
              {
                a_ne_id: '1310102012201HWCSANEL886eec5e565f8581',
                a_ne_name: 'ZW-15562-HB涞水冀家沟-N-HW-OA-M6199',
                a_port_id: '1310302012201HWCSAPRT16e94d966c09fd39',
                a_port_name:
                  'ZW-15562-HB涞水冀家沟-N-HW-OA-M6199-0-21(TN18EFI (TN18EFIB))-ETH2',
                a_address: '保定市涞水县纪家沟村',
                z_ne_id: '1110102012201HWCSANEL5a618a26482ab2ae',
                z_port_id: '1110302012201HWCSAPRT058a43d04ac0e38c',
                z_port_name:
                  'ZW-15561-BJ北京长阳国际-N-HW-OA-M6199-0-3(TN52DAPXF (TN52DAPXF-013))-T_VI',
                z_address: '房山区长阳镇长政南街6号院二里7#1层机房',
                z_ne_name: 'ZW-15561-BJ北京长阳国际-N-HW-OA-M6199'
              },
              {
                a_ne_id: '1110102012201HWCSANEL5a618a26482ab2ae',
                a_ne_name: 'ZW-15561-BJ北京长阳国际-N-HW-OA-M6199',
                a_port_id: '1110302012201HWCSAPRT058a43d04ac0e38c',
                a_port_name:
                  'ZW-15561-BJ北京长阳国际-N-HW-OA-M6199-0-3(TN52DAPXF (TN52DAPXF-013))-T_VI',
                a_address: '房山区长阳镇长政南街6号院二里7#1层机房',
                z_ne_id: '1110102012201HWCSANEL573dffac1756a548',
                z_port_id: '1110302012201HWCSAPRT002ce26f4fa2e453',
                z_port_name:
                  'ZW-15560-BJ北京大白楼-N-HW-OTM-2-0-14(TN97D48 (TN97D4801))-D32',
                z_address: '大兴区团河路8号移动通信楼二期',
                z_ne_name: 'ZW-15560-BJ北京大白楼-N-HW-OTM-2'
              },
              {
                a_ne_id: '1110102012201HWCSANEL573dffac1756a548',
                a_ne_name: 'ZW-15560-BJ北京大白楼-N-HW-OTM-2',
                a_port_id: '1110302012201HWCSAPRT002ce26f4fa2e453',
                a_port_name:
                  'ZW-15560-BJ北京大白楼-N-HW-OTM-2-0-14(TN97D48 (TN97D4801))-D32',
                a_address: '大兴区团河路8号移动通信楼二期',
                z_ne_id: '1110102012201HWCSANELf83cc4455eb6bd24',
                z_port_id: '1110302012201HWCSAPRT003f52c5d8edb59a',
                z_port_name:
                  'ZW-17367-BJ北京大白楼-N-HW-EXC-1-1-19(TNS1N405 (TNS1N405C01))-IN5/OUT5',
                z_address: '大兴区团河路8号移动通信楼二期',
                z_ne_name: 'ZW-17367-BJ北京大白楼-N-HW-EXC-1'
              }
            ],
            [
              {
                a_ne_id: '6410102012201HWCSANEL6e0ce43bc458f4d6',
                a_ne_name: 'ZW-17338-NX中卫云基地-N-HW-EXC-1',
                a_port_id: '6410302012201HWCSAPRT03eb6f9fc0262af6',
                a_port_name:
                  'ZW-17338-NX中卫云基地-N-HW-EXC-1-1-8(TNV4T405 (TNV4T405Q01))-RX1/TX1',
                a_address:
                  '宁夏中卫市沙坡头区凤云路西部云基地中国移动（宁夏）数据中心一号机房楼',
                z_ne_id: '6410102012201HWCSANEL0705dc12da9929f1',
                z_port_id: '6410302012201HWCSAPRT00b04963b4dc0610',
                z_port_name:
                  'ZW-15483-NX中卫云基地-N-HW-OTM-2-1-14(TN97D48 (TN97D4802))-D08',
                z_address:
                  '宁夏中卫市沙坡头区凤云路西部云基地中国移动（宁夏）数据中心一号机房楼',
                z_ne_name: 'ZW-15483-NX中卫云基地-N-HW-OTM-2'
              },
              {
                a_ne_id: '6410102012201HWCSANEL0705dc12da9929f1',
                a_ne_name: 'ZW-15483-NX中卫云基地-N-HW-OTM-2',
                a_port_id: '6410302012201HWCSAPRT00b04963b4dc0610',
                a_port_name:
                  'ZW-15483-NX中卫云基地-N-HW-OTM-2-1-14(TN97D48 (TN97D4802))-D08',
                a_address:
                  '宁夏中卫市沙坡头区凤云路西部云基地中国移动（宁夏）数据中心一号机房楼',
                z_ne_id: '6410102012201HWCSANEL24f13f1e7b493ff9',
                z_port_id: '6410302012201HWCSAPRT1468ae4784d9474b',
                z_port_name:
                  'ZW-15790-NX中卫三古窑沟-N-HW-OA-M6257-0-21(TN18EFI (TN18EFIB))-ETH3',
                z_address: '宁夏中卫沙坡头区永康镇景台村',
                z_ne_name: 'ZW-15790-NX中卫三古窑沟-N-HW-OA-M6257'
              },
              {
                a_ne_id: '6410102012201HWCSANEL24f13f1e7b493ff9',
                a_ne_name: 'ZW-15790-NX中卫三古窑沟-N-HW-OA-M6257',
                a_port_id: '6410302012201HWCSAPRT1468ae4784d9474b',
                a_port_name:
                  'ZW-15790-NX中卫三古窑沟-N-HW-OA-M6257-0-21(TN18EFI (TN18EFIB))-ETH3',
                a_address: '宁夏中卫沙坡头区永康镇景台村',
                z_ne_id: '6410102012201HWCSANELdf3987fa85ae9485',
                z_port_id: '6410302012201HWCSAPRT002fb483afb91065',
                z_port_name:
                  'ZW-15791-NX中卫市梁寨柯-N-HW-OA-M6257-0-3(TN52DAPXF (TN52DAPXF-009))-TM2',
                z_address: '宁夏中卫市海原县兴仁镇梁寨科村梁寨柯小学',
                z_ne_name: 'ZW-15791-NX中卫市梁寨柯-N-HW-OA-M6257'
              },
              {
                a_ne_id: '6410102012201HWCSANELdf3987fa85ae9485',
                a_ne_name: 'ZW-15791-NX中卫市梁寨柯-N-HW-OA-M6257',
                a_port_id: '6410302012201HWCSAPRT002fb483afb91065',
                a_port_name:
                  'ZW-15791-NX中卫市梁寨柯-N-HW-OA-M6257-0-3(TN52DAPXF (TN52DAPXF-009))-TM2',
                a_address: '宁夏中卫市海原县兴仁镇梁寨科村梁寨柯小学',
                z_ne_id: '6410102012201HWCSANEL38ca5daabeebe094',
                z_port_id: '6410302012201HWCSAPRT09a76e9c94850eef',
                z_port_name:
                  'ZW-15792-NX海原新大楼-N-HW-OA-M6257-0-3(TN52DAPXF (TN52DAPXF-009))-R_VI',
                z_address: '宁夏中卫市海原县海城镇政府北街移动公司院内东边二楼',
                z_ne_name: 'ZW-15792-NX海原新大楼-N-HW-OA-M6257'
              },
              {
                a_ne_id: '6410102012201HWCSANEL38ca5daabeebe094',
                a_ne_name: 'ZW-15792-NX海原新大楼-N-HW-OA-M6257',
                a_port_id: '6410302012201HWCSAPRT09a76e9c94850eef',
                a_port_name:
                  'ZW-15792-NX海原新大楼-N-HW-OA-M6257-0-3(TN52DAPXF (TN52DAPXF-009))-R_VI',
                a_address: '宁夏中卫市海原县海城镇政府北街移动公司院内东边二楼',
                z_ne_id: '6410102012201HWCSANELf4cebf121ff71d68',
                z_port_id: '6410302012201HWCSAPRT0007324037202795',
                z_port_name:
                  'ZW-15793-NX海原新区-N-HW-OA-M6257-0-4(TN12AST2 (TN12AST2))-RM1/TM1',
                z_address: '宁夏中卫市海原新区移动楼',
                z_ne_name: 'ZW-15793-NX海原新区-N-HW-OA-M6257'
              },
              {
                a_ne_id: '6410102012201HWCSANELf4cebf121ff71d68',
                a_ne_name: 'ZW-15793-NX海原新区-N-HW-OA-M6257',
                a_port_id: '6410302012201HWCSAPRT0007324037202795',
                a_port_name:
                  'ZW-15793-NX海原新区-N-HW-OA-M6257-0-4(TN12AST2 (TN12AST2))-RM1/TM1',
                a_address: '宁夏中卫市海原新区移动楼',
                z_ne_id: '6410102012201HWCSANEL6ec2586f47135e54',
                z_port_id: '6410302012201HWCSAPRT000c5b67fdc3568c',
                z_port_name:
                  'ZW-15794-NX固原一中心-N-HW-OA-M6257-0-4(TN12AST2 (TN12AST2))-WSC1/WSC1',
                z_address: '中国宁夏固原市原州区移动综合楼',
                z_ne_name: 'ZW-15794-NX固原一中心-N-HW-OA-M6257'
              },
              {
                a_ne_id: '6410102012201HWCSANEL6ec2586f47135e54',
                a_ne_name: 'ZW-15794-NX固原一中心-N-HW-OA-M6257',
                a_port_id: '6410302012201HWCSAPRT000c5b67fdc3568c',
                a_port_name:
                  'ZW-15794-NX固原一中心-N-HW-OA-M6257-0-4(TN12AST2 (TN12AST2))-WSC1/WSC1',
                a_address: '中国宁夏固原市原州区移动综合楼',
                z_ne_id: '6410102012201HWCSANELd016b6e212d79cbf',
                z_port_id: '6410302012201HWCSAPRT0d9a13a778888fe1',
                z_port_name:
                  'ZW-15795-NX隆德汽车站-N-HW-OA-M6257-0-16(TN52DAPXF (TN52DAPXF-014))-T_MON',
                z_address: '中国宁夏固原市隆德县新汽车站',
                z_ne_name: 'ZW-15795-NX隆德汽车站-N-HW-OA-M6257'
              },
              {
                a_ne_id: '6410102012201HWCSANELd016b6e212d79cbf',
                a_ne_name: 'ZW-15795-NX隆德汽车站-N-HW-OA-M6257',
                a_port_id: '6410302012201HWCSAPRT0d9a13a778888fe1',
                a_port_name:
                  'ZW-15795-NX隆德汽车站-N-HW-OA-M6257-0-16(TN52DAPXF (TN52DAPXF-014))-T_MON',
                a_address: '中国宁夏固原市隆德县新汽车站',
                z_ne_id: '6210102012201HWCSANEL74c896998fa1f70b',
                z_port_id: '6210302012201HWCSAPRT00204dd64a553bdd',
                z_port_name:
                  'ZW-15803-GS平凉二产楼-N-HW-OTM-1-5-14(TN97D48 (TN97D4802))-D35',
                z_address: '中国甘肃平凉崆峒区移动二枢纽',
                z_ne_name: 'ZW-15803-GS平凉二产楼-N-HW-OTM-1'
              },
              {
                a_ne_id: '6210102012201HWCSANEL74c896998fa1f70b',
                a_ne_name: 'ZW-15803-GS平凉二产楼-N-HW-OTM-1',
                a_port_id: '6210302012201HWCSAPRT00204dd64a553bdd',
                a_port_name:
                  'ZW-15803-GS平凉二产楼-N-HW-OTM-1-5-14(TN97D48 (TN97D4802))-D35',
                a_address: '中国甘肃平凉崆峒区移动二枢纽',
                z_ne_id: '6210102012201HWCSANEL0859adef29475afb',
                z_port_id: '6210302012201HWCSAPRT0175c52b0f922205',
                z_port_name:
                  'ZW-17373-GS平凉二产楼-N-HW-EXC-1-0-1(TNS1N405 (TNS1N405C01))-IN3/OUT3',
                z_address: '中国甘肃平凉崆峒区移动二枢纽',
                z_ne_name: 'ZW-17373-GS平凉二产楼-N-HW-EXC-1'
              },
              {
                a_ne_id: '6210102012201HWCSANEL0859adef29475afb',
                a_ne_name: 'ZW-17373-GS平凉二产楼-N-HW-EXC-1',
                a_port_id: '6210302012201HWCSAPRT0175c52b0f922205',
                a_port_name:
                  'ZW-17373-GS平凉二产楼-N-HW-EXC-1-0-1(TNS1N405 (TNS1N405C01))-IN3/OUT3',
                a_address: '中国甘肃平凉崆峒区移动二枢纽',
                z_ne_id: '6110102012201HWCSANEL5a15dd57a2cc2b9d',
                z_port_id: '6110302012201HWCSAPRT0167f6acae5116cb',
                z_port_name:
                  'ZW-17247-SX西咸DC-N-HW-EXC-1-0-28(TNV4T405 (TNV4T405Q01))-RX4/TX4',
                z_address: '咸阳秦都西咸数据中心',
                z_ne_name: 'ZW-17247-SX西咸DC-N-HW-EXC-1',
                iscutoff: 'true'
              },
              {
                a_ne_id: '6110102012201HWCSANEL5a15dd57a2cc2b9d',
                a_ne_name: 'ZW-17247-SX西咸DC-N-HW-EXC-1',
                a_port_id: '6110302012201HWCSAPRT0167f6acae5116cb',
                a_port_name:
                  'ZW-17247-SX西咸DC-N-HW-EXC-1-0-28(TNV4T405 (TNV4T405Q01))-RX4/TX4',
                a_address: '咸阳秦都西咸数据中心',
                z_ne_id: '6110102012201HWCSANEL2c54bbf5f2b1c66d',
                z_port_id: '6110302012201HWCSAPRT00e4f208f37c2299',
                z_port_name:
                  'ZW-15611-SX西咸DC-N-HW-OTM-1-1-5(TN97M48V (TN97M48V02))-M10',
                z_address: '咸阳秦都西咸数据中心',
                z_ne_name: 'ZW-15611-SX西咸DC-N-HW-OTM-1'
              },
              {
                a_ne_id: '6110102012201HWCSANEL2c54bbf5f2b1c66d',
                a_ne_name: 'ZW-15611-SX西咸DC-N-HW-OTM-1',
                a_port_id: '6110302012201HWCSAPRT00e4f208f37c2299',
                a_port_name:
                  'ZW-15611-SX西咸DC-N-HW-OTM-1-1-5(TN97M48V (TN97M48V02))-M10',
                a_address: '咸阳秦都西咸数据中心',
                z_ne_id: '6110102012201HWCSANEL3d30e37af95c8c48',
                z_port_id: '6110302012201HWCSAPRT00484577de60056d',
                z_port_name:
                  'ZW-15810-SX西安锦业路-N-HW-OA-M6260-0-4(TN12AST2 (TN12AST2))-TMI1',
                z_address: '',
                z_ne_name: 'ZW-15810-SX西安锦业路-N-HW-OA-M6260'
              },
              {
                a_ne_id: '6110102012201HWCSANEL3d30e37af95c8c48',
                a_ne_name: 'ZW-15810-SX西安锦业路-N-HW-OA-M6260',
                a_port_id: '6110302012201HWCSAPRT00484577de60056d',
                a_port_name:
                  'ZW-15810-SX西安锦业路-N-HW-OA-M6260-0-4(TN12AST2 (TN12AST2))-TMI1',
                a_address: '',
                z_ne_id: '6110102012201HWCSANEL74f1605d623b04e3',
                z_port_id: '6110302012201HWCSAPRT02815512565f7460',
                z_port_name:
                  'ZW-15811-SX渭南三贤路-N-HW-OA-M6260-0-4(TN12AST2 (TN12AST2))-TMI2',
                z_address: '渭南临渭三贤路',
                z_ne_name: 'ZW-15811-SX渭南三贤路-N-HW-OA-M6260'
              },
              {
                a_ne_id: '6110102012201HWCSANEL74f1605d623b04e3',
                a_ne_name: 'ZW-15811-SX渭南三贤路-N-HW-OA-M6260',
                a_port_id: '6110302012201HWCSAPRT02815512565f7460',
                a_port_name:
                  'ZW-15811-SX渭南三贤路-N-HW-OA-M6260-0-4(TN12AST2 (TN12AST2))-TMI2',
                a_address: '渭南临渭三贤路',
                z_ne_id: '6110102012201HWCSANELb5138024910c851b',
                z_port_id: '6110302012201HWCSAPRT015e5c941b4482e6',
                z_port_name:
                  'ZW-15812-SX华阴维护中心-N-HW-OA-M6260-0-3(TN52DAPXF (TN52DAPXF-009))-T_IN',
                z_address: '',
                z_ne_name: 'ZW-15812-SX华阴维护中心-N-HW-OA-M6260'
              },
              {
                a_ne_id: '6110102012201HWCSANELb5138024910c851b',
                a_ne_name: 'ZW-15812-SX华阴维护中心-N-HW-OA-M6260',
                a_port_id: '6110302012201HWCSAPRT015e5c941b4482e6',
                a_port_name:
                  'ZW-15812-SX华阴维护中心-N-HW-OA-M6260-0-3(TN52DAPXF (TN52DAPXF-009))-T_IN',
                a_address: '',
                z_ne_id: '4110102012201HWCSANEL79c99d2aeada7410',
                z_port_id: '4110302012201HWCSAPRT00026dbc7e740aad',
                z_port_name:
                  'ZW-15813-HN灵宝西闫-N-HW-OA-M6260-0-21(TN18EFI (TN18EFIB))-ETH2',
                z_address: '三门峡市灵宝西阎雷家营村',
                z_ne_name: 'ZW-15813-HN灵宝西闫-N-HW-OA-M6260'
              },
              {
                a_ne_id: '4110102012201HWCSANEL79c99d2aeada7410',
                a_ne_name: 'ZW-15813-HN灵宝西闫-N-HW-OA-M6260',
                a_port_id: '4110302012201HWCSAPRT00026dbc7e740aad',
                a_port_name:
                  'ZW-15813-HN灵宝西闫-N-HW-OA-M6260-0-21(TN18EFI (TN18EFIB))-ETH2',
                a_address: '三门峡市灵宝西阎雷家营村',
                z_ne_id: '4110102012201HWCSANELeb8ef785d534ea22',
                z_port_id: '4110302012201HWCSAPRT0f451fbc9220b544',
                z_port_name:
                  'ZW-15814-HN三门峡市迎宾大道-N-HW-OA-M6260-0-16(TN52DAPXF (TN52DAPXF-007))-R_IN',
                z_address: '三门峡市迎宾路',
                z_ne_name: 'ZW-15814-HN三门峡市迎宾大道-N-HW-OA-M6260'
              },
              {
                a_ne_id: '4110102012201HWCSANELeb8ef785d534ea22',
                a_ne_name: 'ZW-15814-HN三门峡市迎宾大道-N-HW-OA-M6260',
                a_port_id: '4110302012201HWCSAPRT0f451fbc9220b544',
                a_port_name:
                  'ZW-15814-HN三门峡市迎宾大道-N-HW-OA-M6260-0-16(TN52DAPXF (TN52DAPXF-007))-R_IN',
                a_address: '三门峡市迎宾路',
                z_ne_id: '4110102012201HWCSANEL8b2981b9a97b3f9c',
                z_port_id: '4110302012201HWCSAPRT0035b3d25ce07089',
                z_port_name:
                  'ZW-15815-HN义马中心局-N-HW-OA-M6260-0-21(TN18EFI (TN18EFIB))-NMETH1',
                z_address: '三门峡市义马',
                z_ne_name: 'ZW-15815-HN义马中心局-N-HW-OA-M6260'
              },
              {
                a_ne_id: '4110102012201HWCSANEL8b2981b9a97b3f9c',
                a_ne_name: 'ZW-15815-HN义马中心局-N-HW-OA-M6260',
                a_port_id: '4110302012201HWCSAPRT0035b3d25ce07089',
                a_port_name:
                  'ZW-15815-HN义马中心局-N-HW-OA-M6260-0-21(TN18EFI (TN18EFIB))-NMETH1',
                a_address: '三门峡市义马',
                z_ne_id: '4110102012201HWCSANEL9ed2dfbbaedb92d6',
                z_port_id: '4110302012201HWCSAPRT00116a56ba029115',
                z_port_name:
                  'ZW-15816-HN洛阳凤化街-N-HW-OTM-1-1-5(TN97M48V (TN97M48V02))-M44',
                z_address: '洛阳市老城区九都东路凤化街230号',
                z_ne_name: 'ZW-15816-HN洛阳凤化街-N-HW-OTM-1'
              },
              {
                a_ne_id: '4110102012201HWCSANEL9ed2dfbbaedb92d6',
                a_ne_name: 'ZW-15816-HN洛阳凤化街-N-HW-OTM-1',
                a_port_id: '4110302012201HWCSAPRT00116a56ba029115',
                a_port_name:
                  'ZW-15816-HN洛阳凤化街-N-HW-OTM-1-1-5(TN97M48V (TN97M48V02))-M44',
                a_address: '洛阳市老城区九都东路凤化街230号',
                z_ne_id: '4110102012201HWCSANEL4a046e2a53a03dd4',
                z_port_id: '4110302012201HWCSAPRT017da6e064aa25cf',
                z_port_name:
                  'ZW-15817-HN登封中心局-N-HW-OA-M6261-0-16(TN52DAPXF (TN52DAPXF-022))-R_IN',
                z_address: '登封市中岳大街移动公司营业部五楼',
                z_ne_name: 'ZW-15817-HN登封中心局-N-HW-OA-M6261'
              },
              {
                a_ne_id: '4110102012201HWCSANEL4a046e2a53a03dd4',
                a_ne_name: 'ZW-15817-HN登封中心局-N-HW-OA-M6261',
                a_port_id: '4110302012201HWCSAPRT017da6e064aa25cf',
                a_port_name:
                  'ZW-15817-HN登封中心局-N-HW-OA-M6261-0-16(TN52DAPXF (TN52DAPXF-022))-R_IN',
                a_address: '登封市中岳大街移动公司营业部五楼',
                z_ne_id: '4110102012201HWCSANELadd70f3dd8d8e095',
                z_port_id: '4110302012201HWCSAPRT2ae0669e9f5bd1bd',
                z_port_name:
                  'ZW-15818-HN郑州郑西开发区-N-HW-OA-M6261-0-4(TN12AST2 (TN12AST2))-6261登封方向',
                z_address: '郑州市西区枢纽楼',
                z_ne_name: 'ZW-15818-HN郑州郑西开发区-N-HW-OA-M6261'
              },
              {
                a_ne_id: '4110102012201HWCSANELadd70f3dd8d8e095',
                a_ne_name: 'ZW-15818-HN郑州郑西开发区-N-HW-OA-M6261',
                a_port_id: '4110302012201HWCSAPRT2ae0669e9f5bd1bd',
                a_port_name:
                  'ZW-15818-HN郑州郑西开发区-N-HW-OA-M6261-0-4(TN12AST2 (TN12AST2))-6261登封方向',
                a_address: '郑州市西区枢纽楼',
                z_ne_id: '4110102012201HWCSANEL2194643f1a65b256',
                z_port_id: '4110302012201HWCSAPRT0051566898b1a196',
                z_port_name:
                  'ZW-15819-HN郑州港区IDC-N-HW-OTM-2-2-6(TN52DAPXF (TN52DAPXF-005))-T_IN',
                z_address: '郑州市港区三官庙办事处岗李村南500米',
                z_ne_name: 'ZW-15819-HN郑州港区IDC-N-HW-OTM-2'
              },
              {
                a_ne_id: '4110102012201HWCSANEL2194643f1a65b256',
                a_ne_name: 'ZW-15819-HN郑州港区IDC-N-HW-OTM-2',
                a_port_id: '4110302012201HWCSAPRT0051566898b1a196',
                a_port_name:
                  'ZW-15819-HN郑州港区IDC-N-HW-OTM-2-2-6(TN52DAPXF (TN52DAPXF-005))-T_IN',
                a_address: '郑州市港区三官庙办事处岗李村南500米',
                z_ne_id: '4110102012201HWCSANEL9d10752e9ef11ee9',
                z_port_id: '4110302012201HWCSAPRT00293d909243694a',
                z_port_name:
                  'ZW-17364-HN郑州港区IDC-N-HW-EXC-1-2-18(TNS1N405 (TNS1N405C01))-IN5/OUT5',
                z_address: '郑州市港区三官庙办事处岗李村南500米',
                z_ne_name: 'ZW-17364-HN郑州港区IDC-N-HW-EXC-1'
              },
              {
                a_ne_id: '4110102012201HWCSANEL9d10752e9ef11ee9',
                a_ne_name: 'ZW-17364-HN郑州港区IDC-N-HW-EXC-1',
                a_port_id: '4110302012201HWCSAPRT00293d909243694a',
                a_port_name:
                  'ZW-17364-HN郑州港区IDC-N-HW-EXC-1-2-18(TNS1N405 (TNS1N405C01))-IN5/OUT5',
                a_address: '郑州市港区三官庙办事处岗李村南500米',
                z_ne_id: '4110102012201HWCSANELd40e491d9cb4577f',
                z_port_id: '4110302012201HWCSAPRT004958922016d001',
                z_port_name:
                  'ZW-15820-HN郑州港区IDC-N-HW-OTM-3-2-14(TN97D48 (TN97D4801))-D09',
                z_address: '郑州市港区三官庙办事处岗李村南500米',
                z_ne_name: 'ZW-15820-HN郑州港区IDC-N-HW-OTM-3'
              },
              {
                a_ne_id: '4110102012201HWCSANELd40e491d9cb4577f',
                a_ne_name: 'ZW-15820-HN郑州港区IDC-N-HW-OTM-3',
                a_port_id: '4110302012201HWCSAPRT004958922016d001',
                a_port_name:
                  'ZW-15820-HN郑州港区IDC-N-HW-OTM-3-2-14(TN97D48 (TN97D4801))-D09',
                a_address: '郑州市港区三官庙办事处岗李村南500米',
                z_ne_id: '4110102012201HWCSANEL01389101d482577e',
                z_port_id: '4110302012201HWCSAPRT0639dda6b4c70d8e',
                z_port_name:
                  'ZW-16052-HN郑州北环-N-HW-OA-M6307-0-3(TN52DAPXF (TN52DAPXF-022))-R_MON',
                z_address: '北环经三路交叉口往东移动枢纽楼 枢纽楼8楼电力室',
                z_ne_name: 'ZW-16052-HN郑州北环-N-HW-OA-M6307'
              },
              {
                a_ne_id: '4110102012201HWCSANEL01389101d482577e',
                a_ne_name: 'ZW-16052-HN郑州北环-N-HW-OA-M6307',
                a_port_id: '4110302012201HWCSAPRT0639dda6b4c70d8e',
                a_port_name:
                  'ZW-16052-HN郑州北环-N-HW-OA-M6307-0-3(TN52DAPXF (TN52DAPXF-022))-R_MON',
                a_address: '北环经三路交叉口往东移动枢纽楼 枢纽楼8楼电力室',
                z_ne_id: '4110102012201HWCSANELaa61244142707594',
                z_port_id: '4110302012201HWCSAPRT02f7b44134036e30',
                z_port_name:
                  'ZW-16051-HN新乡新中大道-N-HW-OA-M6307-0-16(TN52DAPXF (TN52DAPXF-022))-R_OUT',
                z_address: '新乡市市区新中大道666号',
                z_ne_name: 'ZW-16051-HN新乡新中大道-N-HW-OA-M6307'
              },
              {
                a_ne_id: '4110102012201HWCSANELaa61244142707594',
                a_ne_name: 'ZW-16051-HN新乡新中大道-N-HW-OA-M6307',
                a_port_id: '4110302012201HWCSAPRT02f7b44134036e30',
                a_port_name:
                  'ZW-16051-HN新乡新中大道-N-HW-OA-M6307-0-16(TN52DAPXF (TN52DAPXF-022))-R_OUT',
                a_address: '新乡市市区新中大道666号',
                z_ne_id: '4110102012201HWCSANELf1f05a820e1ce7df',
                z_port_id: '4110302012201HWCSAPRT037ea38f012a7b42',
                z_port_name:
                  'ZW-16050-HN鹤壁淇水大道-N-HW-OA-M6307-0-4(TN12AST2 (TN12AST2))-收安阳方向1511',
                z_address: '鹤壁淇滨区淇水大道',
                z_ne_name: 'ZW-16050-HN鹤壁淇水大道-N-HW-OA-M6307'
              },
              {
                a_ne_id: '4110102012201HWCSANELf1f05a820e1ce7df',
                a_ne_name: 'ZW-16050-HN鹤壁淇水大道-N-HW-OA-M6307',
                a_port_id: '4110302012201HWCSAPRT037ea38f012a7b42',
                a_port_name:
                  'ZW-16050-HN鹤壁淇水大道-N-HW-OA-M6307-0-4(TN12AST2 (TN12AST2))-收安阳方向1511',
                a_address: '鹤壁淇滨区淇水大道',
                z_ne_id: '4110102012201HWCSANEL16413aae2c7a8e62',
                z_port_id: '4110302012201HWCSAPRT00f01f82890e557d',
                z_port_name:
                  'ZW-15007-HN安阳黄河路-N-HW-OTM-2-0-5(TN97M48V (TN97M48V01))-M06',
                z_address: '安阳市黄河大道生产楼中心',
                z_ne_name: 'ZW-15007-HN安阳黄河路-N-HW-OTM-2'
              },
              {
                a_ne_id: '4110102012201HWCSANEL16413aae2c7a8e62',
                a_ne_name: 'ZW-15007-HN安阳黄河路-N-HW-OTM-2',
                a_port_id: '4110302012201HWCSAPRT00f01f82890e557d',
                a_port_name:
                  'ZW-15007-HN安阳黄河路-N-HW-OTM-2-0-5(TN97M48V (TN97M48V01))-M06',
                a_address: '安阳市黄河大道生产楼中心',
                z_ne_id: '1310102012201HWCSANELe08efae02956a3ce',
                z_port_id: '1310302012201HWCSAPRT04c6054a5cb0b4f4',
                z_port_name:
                  'ZW-15006-HB邯郸全球通大厦-N-HW-OA-M6102-0-4(TN12AST2 (TN12AST2))-EOW',
                z_address: '邯郸邯山区',
                z_ne_name: 'ZW-15006-HB邯郸全球通大厦-N-HW-OA-M6102'
              },
              {
                a_ne_id: '1310102012201HWCSANELe08efae02956a3ce',
                a_ne_name: 'ZW-15006-HB邯郸全球通大厦-N-HW-OA-M6102',
                a_port_id: '1310302012201HWCSAPRT04c6054a5cb0b4f4',
                a_port_name:
                  'ZW-15006-HB邯郸全球通大厦-N-HW-OA-M6102-0-4(TN12AST2 (TN12AST2))-EOW',
                a_address: '邯郸邯山区',
                z_ne_id: '1310102012201HWCSANEL331503f043d7ac0f',
                z_port_id: '1310302012201HWCSAPRT0336742c134dd180',
                z_port_name:
                  'ZW-15005-HB邢台东环局-N-HW-OA-M6102-0-4(TN12AST2 (TN12AST2))-TMI1',
                z_address: '邢台桥东区富强大街与东外环交叉口',
                z_ne_name: 'ZW-15005-HB邢台东环局-N-HW-OA-M6102'
              },
              {
                a_ne_id: '1310102012201HWCSANEL331503f043d7ac0f',
                a_ne_name: 'ZW-15005-HB邢台东环局-N-HW-OA-M6102',
                a_port_id: '1310302012201HWCSAPRT0336742c134dd180',
                a_port_name:
                  'ZW-15005-HB邢台东环局-N-HW-OA-M6102-0-4(TN12AST2 (TN12AST2))-TMI1',
                a_address: '邢台桥东区富强大街与东外环交叉口',
                z_ne_id: '1310102012201HWCSANEL4082e6e6b2d08996',
                z_port_id: '1310302012201HWCSAPRT08053086310e345b',
                z_port_name:
                  'ZW-15004-HB高邑移动-N-HW-OA-M6102-0-4(TN13VA4 (TN13VA401))-IN4/OUT4',
                z_address: '石家庄高邑县府前路67号',
                z_ne_name: 'ZW-15004-HB高邑移动-N-HW-OA-M6102'
              },
              {
                a_ne_id: '1310102012201HWCSANEL4082e6e6b2d08996',
                a_ne_name: 'ZW-15004-HB高邑移动-N-HW-OA-M6102',
                a_port_id: '1310302012201HWCSAPRT08053086310e345b',
                a_port_name:
                  'ZW-15004-HB高邑移动-N-HW-OA-M6102-0-4(TN13VA4 (TN13VA401))-IN4/OUT4',
                a_address: '石家庄高邑县府前路67号',
                z_ne_id: '1310102012201HWCSANEL180850be640ee483',
                z_port_id: '1310302012201HWCSAPRT0006357eba30eea0',
                z_port_name:
                  'ZW-15782-HB石家庄开发区-N-HW-OTM-1-5-3(TN97M48V (TN97M48V02))-M18',
                z_address: '石家庄开发区昆仑大街89号',
                z_ne_name: 'ZW-15782-HB石家庄开发区-N-HW-OTM-1'
              },
              {
                a_ne_id: '1310102012201HWCSANEL180850be640ee483',
                a_ne_name: 'ZW-15782-HB石家庄开发区-N-HW-OTM-1',
                a_port_id: '1310302012201HWCSAPRT0006357eba30eea0',
                a_port_name:
                  'ZW-15782-HB石家庄开发区-N-HW-OTM-1-5-3(TN97M48V (TN97M48V02))-M18',
                a_address: '石家庄开发区昆仑大街89号',
                z_ne_id: '1310102012201HWCSANEL84f8f74b7a44a07e',
                z_port_id: '1310302012201HWCSAPRT00083c73d47f76c5',
                z_port_name:
                  'ZW-17263-HB石家庄开发区-N-HW-EXC-1-0-32(TNS1N405 (TNS1N405C01))-IN2/OUT2',
                z_address: '石家庄开发区昆仑大街89号',
                z_ne_name: 'ZW-17263-HB石家庄开发区-N-HW-EXC-1'
              },
              {
                a_ne_id: '1310102012201HWCSANEL84f8f74b7a44a07e',
                a_ne_name: 'ZW-17263-HB石家庄开发区-N-HW-EXC-1',
                a_port_id: '1310302012201HWCSAPRT00083c73d47f76c5',
                a_port_name:
                  'ZW-17263-HB石家庄开发区-N-HW-EXC-1-0-32(TNS1N405 (TNS1N405C01))-IN2/OUT2',
                a_address: '石家庄开发区昆仑大街89号',
                z_ne_id: '1310102012201HWCSANELc022a5eec59e600a',
                z_port_id: '1310302012201HWCSAPRT001eef0c4ca46c64',
                z_port_name:
                  'ZW-15060-HB石家庄开发区-N-HW-OTM-3-5-14(TN97D48 (TN97D4802))-D19',
                z_address: '石家庄开发区昆仑大街89号',
                z_ne_name: 'ZW-15060-HB石家庄开发区-N-HW-OTM-3'
              },
              {
                a_ne_id: '1310102012201HWCSANELc022a5eec59e600a',
                a_ne_name: 'ZW-15060-HB石家庄开发区-N-HW-OTM-3',
                a_port_id: '1310302012201HWCSAPRT001eef0c4ca46c64',
                a_port_name:
                  'ZW-15060-HB石家庄开发区-N-HW-OTM-3-5-14(TN97D48 (TN97D4802))-D19',
                a_address: '石家庄开发区昆仑大街89号',
                z_ne_id: '1310102012201HWCSANELefdd678f84da3842',
                z_port_id: '1310302012201HWCSAPRT0152db4801854492',
                z_port_name:
                  'ZW-15059-HB定州移动-N-HW-OA-M6110-0-16(TN52DAPXF (TN52DAPXF-009))-RM1',
                z_address: '保定定州',
                z_ne_name: 'ZW-15059-HB定州移动-N-HW-OA-M6110'
              },
              {
                a_ne_id: '1310102012201HWCSANELefdd678f84da3842',
                a_ne_name: 'ZW-15059-HB定州移动-N-HW-OA-M6110',
                a_port_id: '1310302012201HWCSAPRT0152db4801854492',
                a_port_name:
                  'ZW-15059-HB定州移动-N-HW-OA-M6110-0-16(TN52DAPXF (TN52DAPXF-009))-RM1',
                a_address: '保定定州',
                z_ne_id: '1310102012201HWCSANEL22e1ca6f2ea5050c',
                z_port_id: '1310302012201HWCSAPRT0209772a1fdf9537',
                z_port_name:
                  'ZW-15058-HB保定DC-N-HW-OADM-1-0-11(TN53DWSS20 (TN53DWSS2001))-MONI',
                z_address: '河北省保定市复兴东路与焦银路交叉口（支点国际附近）',
                z_ne_name: 'ZW-15058-HB保定DC-N-HW-OADM-1'
              },
              {
                a_ne_id: '1310102012201HWCSANEL22e1ca6f2ea5050c',
                a_ne_name: 'ZW-15058-HB保定DC-N-HW-OADM-1',
                a_port_id: '1310302012201HWCSAPRT0209772a1fdf9537',
                a_port_name:
                  'ZW-15058-HB保定DC-N-HW-OADM-1-0-11(TN53DWSS20 (TN53DWSS2001))-MONI',
                a_address: '河北省保定市复兴东路与焦银路交叉口（支点国际附近）',
                z_ne_id: '1310102012201HWCSANEL6547ef83fc899cab',
                z_port_id: '1310302012201HWCSAPRT0084eb83ccca5b90',
                z_port_name:
                  'ZW-15057-HB定兴移动-N-HW-OA-M6110-0-4(TN12AST2 (TN12AST2))-TMI1',
                z_address: '保定定兴',
                z_ne_name: 'ZW-15057-HB定兴移动-N-HW-OA-M6110'
              },
              {
                a_ne_id: '1310102012201HWCSANEL6547ef83fc899cab',
                a_ne_name: 'ZW-15057-HB定兴移动-N-HW-OA-M6110',
                a_port_id: '1310302012201HWCSAPRT0084eb83ccca5b90',
                a_port_name:
                  'ZW-15057-HB定兴移动-N-HW-OA-M6110-0-4(TN12AST2 (TN12AST2))-TMI1',
                a_address: '保定定兴',
                z_ne_id: '1110102012201HWCSANEL51483d829cf63088',
                z_port_id: '1110302012201HWCSAPRT03b68fea7ce58c51',
                z_port_name:
                  'ZW-15056-BJ北京良乡综合楼-N-HW-OA-M6110-0-16(TN52DAPXF (TN52DAPXF-009))-R_MON',
                z_address: '北京市房山区良乡东路16号',
                z_ne_name: 'ZW-15056-BJ北京良乡综合楼-N-HW-OA-M6110'
              },
              {
                a_ne_id: '1110102012201HWCSANEL51483d829cf63088',
                a_ne_name: 'ZW-15056-BJ北京良乡综合楼-N-HW-OA-M6110',
                a_port_id: '1110302012201HWCSAPRT03b68fea7ce58c51',
                a_port_name:
                  'ZW-15056-BJ北京良乡综合楼-N-HW-OA-M6110-0-16(TN52DAPXF (TN52DAPXF-009))-R_MON',
                a_address: '北京市房山区良乡东路16号',
                z_ne_id: '1110102012201HWCSANELf83cc4455eb6bd24',
                z_port_id: '1110302012201HWCSAPRT003f52c5d8edb59a',
                z_port_name:
                  'ZW-17367-BJ北京大白楼-N-HW-EXC-1-1-19(TNS1N405 (TNS1N405C01))-IN5/OUT5',
                z_address: '大兴区团河路8号移动通信楼二期',
                z_ne_name: 'ZW-17367-BJ北京大白楼-N-HW-EXC-1'
              }
            ]
          ]
        }
      ]
    }
  }
};
const dateFormat = 'YYYY-MM-DD HH:ss';
const today = moment().format(dateFormat);
const today2H = moment()
  .add(2, 'hours')
  .format(dateFormat);

class BslineDetail extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    const { lineInfo, businessType } = state;
    this.state = {
      timeRage: [moment(today, dateFormat), moment(today2H, dateFormat)],
      businessType: Number(businessType),
      lineName: lineInfo.id || '',
      customerName: lineInfo.name || '',
      activityAlarm: {
        summary: 0,
        alarm: {}
      },
      severityTime: '',
      sendAlready: {
        auto: 0,
        manual: 0
      },
      cutNumber: {
        today: { total: 0, finished: 0, unfinished: 0 },
        tomorrow: { total: 0, finished: 0, unfinished: 0 },
        yestoday: { total: 0, finished: 0, unfinished: 0 }
      },
      alarmList: [],
      rateNameArr: [],
      lineData: [],
      rateIdx: 0,
      // rateActivedArr: ['active', '', '', ],
      rate: 'ser',
      rateText: '误码率(%)',
      routerList: data.resultxml.circuit.path[0].route[0],

      warnModalVisible: false,
      otnId: '',
      otnName: ''
    };
  }
  static propTypes = {
    clientInfo: PropTypes.array,
    businessType: PropTypes.string,
    customerName: PropTypes.string
  };
  componentDidMount = () => {
    this.getClientData();
    this.getCutNumber();
  };
  disabledDate = current => {
    const disabledStartDate =
      current <
      moment()
        .endOf('day')
        .subtract(1, 'months');
    const disabledEndDate =
      current >
      moment()
        .startOf('day')
        .add(1, 'months');
    return disabledStartDate || disabledEndDate;
  };
  onTimeChange = dateString => {
    this.setState({ timeRage: dateString }, () => {
      const { timeRage } = this.state;
      // this.handlePageChange(1, pageSize, searchKey);
      console.log(moment(timeRage[0]).format(dateFormat));
    });
  };
  selectRate = idx => () => {
    const { rateNameArr } = this.state;
    this.setState(
      {
        rateIdx: idx,
        rate: rateNameArr[idx].performance,
        rateText: functionIdx[rateNameArr[idx].performance].name
      },
      () => {
        const { businessType, lineName, rate } = this.state;
        const url = `api/efficiency/stats/${rate}/timed`;
        if (businessType === 0) {
          this.getFunctionIndex(lineName, url);
        } else {
          this.getFunctionIndex(lineName, url);
        }
      }
    );
  };
  // 活动告警
  getAlarmActivity = (businessType, leasedLine) => {
    // 查询告警信息的按告警级别
    getAxios(
      'api/alarms/stats/num/severity',
      { businessType, leasedLine },
      data => {
        this.setState({
          activityAlarm: {
            summary: data.summary,
            alarm: data.values
          },
          severityTime: data.time.timeRange.until
        });
      }
    );
    // 已派单
    getAxios('api/alarms/stats/num/sheet_send_status', { leasedLine }, data => {
      this.setState({
        sendAlready: {
          ...data.values
        }
      });
    });
  };
  // 告警列表
  getAlarmList = (businessType, leasedLine) => {
    getAxios('api/alarms', { businessType, leasedLine }, data => {
      this.setState({
        alarmList: data.results
      });
    });
  };
  // 四个性能指标
  getEchartLine = leasedLine => {
    getAxios('api/efficiency/stats/current', { leasedLine }, data => {
      this.setState({
        rateNameArr: obj2Arr(data.values)
      });
    });
  };
  // 性能指标echarts折线图（根据客户名称及性能指标查询）
  getFunctionIndex = (leasedLine, url) => {
    getAxios(url, { leasedLine }, data => {
      this.setState({
        lineData: objectMomentLine(data.values)
      });
    });
  };
  getClientData = () => {
    const { businessType, lineName } = this.state;
    const url = 'api/efficiency/stats/ser/timed';
    // businessType = '0'为全部业务，请求数据时不传递该参数
    if (businessType === 0) {
      this.getAlarmActivity(null, lineName);
      this.getAlarmList(null, lineName);
      this.getEchartLine(lineName);
      this.getFunctionIndex(lineName, url);
    } else {
      this.getAlarmActivity(businessType, lineName);
      this.getAlarmList(businessType, lineName);
      this.getEchartLine(lineName);
      this.getFunctionIndex(lineName, url);
    }
  };
  // 统计昨天、今天、明天的信息
  getCutNumber = () =>
    postMockAxios('api/cutover/stats/num/date', data =>
      this.setState({ cutNumber: data.values })
    );

  setWarnOtnLineDetail = (otnId, otnName) => {
    otnId &&
      otnName &&
      this.setState({ otnId, otnName, warnModalVisible: true });
  };

  clearWarnOtnLineDetail = () => {
    this.setState({ otnId: '', otnName: '', warnModalVisible: false });
  };

  onWarnModalClose = () => {
    this.setState({ warnModalVisible: false });
  };

  goBackLink = () => {
    let backToHome;
    const { state } = this.props.location;
    if (state) {
      const { gotoHome } = state;
      if (gotoHome) {
        backToHome = gotoHome;
      }
    }

    return !backToHome
      ? '/main/business'
      : {
        pathname: '/main/home',
        state: { tab: '3' }
      };
  };

  render() {
    const RangePicker = DatePicker.RangePicker;
    const dateFormat = 'YYYY-MM-DD HH:ss';
    const {
      rateIdx,
      rateText,
      activityAlarm,
      severityTime,
      sendAlready,
      alarmList,
      rateNameArr,
      lineData,
      routerList,
      timeRage
    } = this.state;
    // 客户详情页面--专线列表传递过来的item
    const { lineInfo } = this.props.location.state;
    const cutoverTime = moment(Number(severityTime)).format('HH:mm');
    const startTime = moment().valueOf();
    const cutoverToday = 0;
    const complished = 0;
    const uncomplished = 0;
    const canceled = 0;
    const complishedRate = 0;
    const uncomplishedRate = 0;
    // const cutoverToday = cutNumber.today.total || 0;
    // const complished = cutNumber.today.finished || 0;
    // const uncomplished = cutNumber.today.unfinished || 0;
    // const canceled = cutoverToday - complished - uncomplished || 0;
    // const complishedRate = parseInt(((complished / cutoverToday) * 100).toFixed(2), 10) || 0;
    // const uncomplishedRate = parseInt((((complished + canceled) / cutoverToday) * 100).toFixed(2), 10) || 0;
    const color = ['#FFBB44'];
    const xData = lineData[0] || [];
    const indexData = lineData[1] || [];
    const listContent = [];
    if (routerList.length !== 0) {
      routerList.forEach((item, index) => {
        listContent.push(<ListItem router={item} key={index} />);
      });
    }
    const kaitongT = moment('2018-12-23').format('YYYY-MM-DD');

    return (
      <div className="bsline-detail">
        <ModalDemo
          visible={this.state.warnModalVisible}
          onClose={this.onWarnModalClose}
          otnId={this.state.otnId}
          otnName={this.state.otnName}
        />
        <div className="detail-header clearfix">
          <div>
            <Link to={this.goBackLink()}>{'<'}返回</Link>
            <span className="line-text">专线详情</span>
          </div>
          {!1 && (
            <div className="select-date">
              <span>时间：</span>
              <RangePicker
                value={timeRage}
                disabledDate={this.disabledDate}
                format={dateFormat}
                showTime
                onChange={this.onTimeChange}
              />
            </div>
          )}
        </div>
        <div className="detail-content">
          <Row>
            <Col span={24}>
              <div className="cutover-topic">
                <div className="topic-left clearfix">
                  <Iframe
                    url={`${baseStaticUrl}gis/gis3/topo/main.html`}
                    events={{
                      setWarnOtnLineDetail: this.setWarnOtnLineDetail,
                      clearWarnOtnLineDetail: this.clearWarnOtnLineDetail
                    }}
                  />
                </div>
                <div className="topic-right clearfix">
                  <div className="topic-header">
                    <div className="line-info-name" title={lineInfo.name}>
                      {lineInfo.name}
                    </div>
                    {/* <span className="object-name">割接对象名称割接对象名称</span> */}
                    <div className="topic-wrapper">
                      <div>
                        <div className="topic-kaitong">
                          <img src={kaitong} alt="kaitongtime" />
                          <span>{kaitongT}</span>
                        </div>
                      </div>
                      <div>
                        <div className="topic-count">
                          {lineInfo.customerName}
                        </div>
                      </div>
                      <div>
                        <div className="topic-count">传输专线</div>
                      </div>
                      <div>
                        <div className="topic-count">
                          {lineInfo.businessBandwidth}
                        </div>
                      </div>
                    </div>
                    <div className="topic-wrapper-two">
                      <div>
                        <div className="topic-count">历史故障：0</div>
                      </div>
                      <div>
                        <div className="topic-count">历史投诉：0</div>
                      </div>
                      <div>
                        <div className="topic-count">历史告警：0</div>
                      </div>
                      <div>
                        <div className="topic-count">历史性能劣化：0</div>
                      </div>
                    </div>
                  </div>
                  <div className="start-time clearfix">
                    <div />
                    <div>A端传输设备：</div>
                    {/* <td title={lineInfo.aacsRoomEqName}>{lineInfo.aacsRoomEqName}</td> */}
                    <div title={'ZW-17338-NX中卫云基地-N-HW-EXC-1'}>
                      ZW-17338-NX中卫云基地-N-HW-EXC-1
                    </div>
                  </div>
                  <div className="start-time clearfix">
                    <div />
                    <div>Z端传输设备：</div>
                    {/* <td title={lineInfo.zacsRoomEqName}>{lineInfo.zacsRoomEqName}</td> */}
                    <div title={'ZW-17367-BJ北京大白楼-N-HW-EXC-1'}>
                      ZW-17367-BJ北京大白楼-N-HW-EXC-1
                    </div>
                  </div>
                  {/* <div className="coutover-status">
                    <Progress type="circle" percent={100} width={50} />
                    <span>割接成功</span>
                  </div> */}
                  <div className="route-list">
                    <div className="route">
                      <div className="tit">
                        <div className="line" />
                        <div className="dot" />
                        <p>电路路由</p>
                        <div className="dot" />
                        <div className="line" />
                      </div>
                      <ul className="cont">{listContent}</ul>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="content-body">
            <div className="body-left">
              <div className="title clearfix">
                <span>网络割接</span>
                <Link
                  className="link"
                  to={{
                    pathname: '/main/fault/cutover',
                    state: {
                      cutTime: startTime
                    }
                  }}
                >
                  详情>>
                </Link>
                <span className="detail">{cutoverTime}</span>
              </div>
              <div className="cutover-today">
                <div className="total-cutover">
                  当前割接:<span>{cutoverToday}</span>
                </div>
                <div className="unfinished-cutover">
                  <Progress
                    percent={uncomplishedRate}
                    successPercent={complishedRate}
                    strokeWidth={12}
                    showInfo={false}
                    className={uncomplished === 0 ? 'no-data' : ''}
                  />
                  <div className="start-time clearfix">
                    <div />
                    <div>已完成:&nbsp;</div>
                    <div>{complished}</div>
                  </div>
                  <div className="end-time clearfix">
                    <div />
                    <div>已取消:&nbsp;</div>
                    <div>{canceled}</div>
                  </div>
                  <div className="uncomplished clearfix">
                    <div />
                    <div>未完成:&nbsp;</div>
                    <div>{uncomplished}</div>
                  </div>
                </div>
                <div className="finished-cutover">
                  完成率<span>{'--'}</span>
                </div>
                {/* <div className="finished-cutover">完成率<span>{`${complishedRate}%`}</span></div> */}
              </div>
            </div>
            <div className="body-right">
              <div className="title clearfix">
                <span>活动告警</span>
                <span className="detail">{cutoverTime}</span>
              </div>
              <ActivityAlarm
                {...{
                  activityAlarm: activityAlarm,
                  sendAlready: sendAlready
                }}
              />
            </div>
          </div>
          <div className="content-footer">
            <div className="footer-left">
              <div className="title">
                <span>性能指标</span>
              </div>
              <FunctionIndex
                {...{
                  rateNameArr: rateNameArr,
                  rateIdx: rateIdx,
                  selectRate: this.selectRate
                }}
              />
              <div className="footer-bar">
                {indexData.length === 0 ? (
                  <div className="zanwu">暂无数据...</div>
                ) : (
                  <div className="line-chart">
                    <Linechart
                      {...{
                        aAxis: xData,
                        rateText: rateText,
                        lineColor: color,
                        lineData: indexData
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="footer-right">
              <div className="title">
                <span>告警</span>
              </div>
              <AlarmList
                {...{
                  alarmList: alarmList
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BslineDetail;
