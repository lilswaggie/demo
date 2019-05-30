import React from 'react';

import { Table } from 'antd';

import moment from 'moment/moment';

import TablePagination from '../component/pub/TablePagination';
import Iframe from './Iframe';
import ListItem from '../component/business-fault/LineDetailList';
import ModalDemo from './modal';
import WarnModal from '../component/pub/modal/WarnModal';

import { getAxios, getMockAxios } from '../axios/mainAxios';
import { formatNumber, baseStaticUrl } from '../util/CommonUtils';
import { goBack, gotoPath } from '../util/ReduxUtil';

import '../assets/css/linedetail/linedetail.scss';

import kaitong from '../component/business-manage/components/kaitong-time.svg';

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

// // 模拟电路路由的数据
// const routerList = [
//     {
//         start: {name:'设备名称001',isfault:true},
//         end: {name:'设备名称0001',isfault:false},
//         port:[{
//             name:'南区企业天地-1/PTNZX6200',
//             addr:'这里是设备名称001的地址'
//         },{
//             name:'南区企业天地-1/PTNZX6200',
//             addr:'这里是设备名称001的地址'
//         }]
//     },
//     {
//         start: {name:'设备名称002',isfault:false},
//         end: {name:'设备名称0002',isfault:true},
//         port:[{
//             name:'南区企业天地-1/PTNZX6200',
//             addr:'这里是设备名称001的地址'
//         },{
//             name:'南区企业天地-1/PTNZX6200',
//             addr:'这里是设备名称001的地址'
//         }]
//     },{
//         start: {name:'设备名称001',isfault:true},
//         end: {name:'设备名称0001',isfault:false},
//         port:[{
//             name:'南区企业天地-1/PTNZX6200',
//             addr:'这里是设备名称001的地址'
//         },{
//             name:'南区企业天地-1/PTNZX6200',
//             addr:'这里是设备名称001的地址'
//         }]
//     },
//     {
//         start: {name:'设备名称002',isfault:false},
//         end: {name:'设备名称0002',isfault:true},
//         port:[{
//             name:'南区企业天地-1/PTNZX6200',
//             addr:'这里是设备名称001的地址'
//         },{
//             name:'南区企业天地-1/PTNZX6200',
//             addr:'这里是设备名称001的地址'
//         }]
//     }
// ];

// 告警级别中文对应名称
const alarmCh = [
  {
    name: '一级告警',
    color: '#FF6464'
  },
  {
    name: '二级告警',
    color: '#FFEC6F'
  },
  {
    name: '三级告警',
    color: '#FFA85A'
  },
  {
    name: '四级告警',
    color: '#8BBCFE'
  }
];
export default class LineDetail extends React.Component {
  state = {
    lineData: {
      client: '',
      businessBandwidth: 0
      // abusinessEquipName:'',
      // zbusinessEquipName:'',
    },
    abusinessEquipName: data.resultxml.circuit.a_transne_id_value,
    zbusinessEquipName: data.resultxml.circuit.z_transne_id_value,
    routerList: data.resultxml.circuit.path[0].route[0],
    // routerList:routerList,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    warnSummary: 0,
    warnCountValues: {},
    warnList: [],

    warnModalVisible: false,
    otnId: '',
    otnName: ''
  };

  componentDidMount() {
    const { state } = this.props.location;
    if (!state || !state.record || !state.record.id) {
      gotoPath('/main/home');
    } else {
      this.setData();
    }
  }

  setData = () => {
    this.getLineData();
    this.getAlarmData();
    this.getTableData();
  };

  // 请求右上部分专线相关数据
  getLineData = () => {
    // TODO: 参数待定
    getMockAxios('api/leased_lines', {}, data => {
      this.setState({
        lineData: {
          client: data.results[0].customerName,
          businessBandwidth: data.results[0].businessBandwidth
          // abusinessEquipName:data.results[0].abusinessEquipName,
          // zbusinessEquipName:data.results[0].zbusinessEquipName,
        }
      });
    });
  };

  warnListUrlMap = {
    network: 'api/alarms',
    business: 'api/alarms/business'
  };

  // 请求下侧告警表格
  getTableData = (
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {
    // 查询业务告警列表（查询该专线）
    getAxios(
      this.warnListUrlMap[this.props.location.state.from],
      {
        leasedLine: this.props.location.state.record.id,
        currentPage: pageNum - 1,
        pageSize: pageSize
      },
      data => {
        const arr = [];
        data.results.map((item, index) => {
          item.id = index;
          arr.push(item);
          return arr;
        });
        this.setState({
          warnList: arr,
          total: data.totalElements,
          pageNum,
          pageSize
        });
      }
    );
  };
  // 请求告警总数以及各个级别告警数
  getAlarmData = elementId => {
    // 查询告警信息的按告警级别（1, 2, 3, 4）统计结果，同时查询告警总数。查询实时的统计结果
    getAxios(
      'api/alarms/stats/num/severity',
      { leasedLine: this.props.location.state.record.id },
      data =>
        this.setState({
          warnSummary: data.summary,
          warnCountValues: data.values
        })
    );
  };

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

  render() {
    const { state } = this.props.location;
    const {
      lineData,
      abusinessEquipName,
      zbusinessEquipName,
      warnList,
      routerList,
      warnCountValues,
      warnSummary,
      pageNum,
      pageSize,
      total
    } = this.state;
    const kaitongT = moment('2018-12-23').format('YYYY-MM-DD');
    // 表格列
    const columns = [
      {
        title: '告警级别',
        render: (text, record) => (
          <div
            className="alarm"
            style={{ backgroundColor: `${alarmCh[record.severity - 1].color}` }}
          >
            {alarmCh[record.severity - 1].name}
          </div>
        ),
        width: '15%',
        align: 'center',
        key: 1
      },
      {
        title: '专线名称',
        render: (text, record) => (
          <div className="control-line" title={record.leasedLine}>
            {record.leasedLine}
          </div>
        ),
        align: 'left',
        width: '20%',
        key: 2
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        align: 'left',
        width: '20%',
        className: 'control-line',
        key: 3
      },
      {
        title: '告警标题',
        dataIndex: 'title',
        align: 'left',
        width: '20%',
        className: 'control-line',
        key: 4
      },
      {
        title: '告警发生时间',
        render: (text, record) => (
          <div>
            {moment(record.alarmedAt - 0).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
        align: 'left',
        width: '25%',
        className: 'control-line',
        key: 5
      }
    ];

    const listContent = [];
    routerList &&
      routerList.length &&
      routerList.forEach((item, index) => {
        listContent.push(<ListItem router={item} key={index} />);
      });

    const fromPage = this.props.location.state.from;

    return (
      <div className="line-detail">
        <ModalDemo
          visible={this.state.warnModalVisible}
          onClose={this.onWarnModalClose}
          otnId={this.state.otnId}
          otnName={this.state.otnName}
        />
        <div className="title">
          <span className="item1" onClick={goBack}>
            &lt; 返回
          </span>
          <div className="line" />
          <span className="item2">专线视图</span>
        </div>
        <div className="content">
          <div className="block1">
            <div className="left">
              <Iframe
                url={`${baseStaticUrl}gis/gis3/topo/main.html`}
                events={{
                  setWarnOtnLineDetail: this.setWarnOtnLineDetail,
                  clearWarnOtnLineDetail: this.clearWarnOtnLineDetail
                }}
              />
            </div>
            <div className="right">
              {/* <div className="line-name">
                                <div className="line1">{state.record.name}</div>
                                <div className="line2"><span>{lineData.client}</span><span>传输专线</span><span>{lineData.businessBandwidth}G</span></div>
                            </div> */}
              <div className="topic-header">
                <div className="line-info-name" title={state.record.name}>
                  {state.record.name}
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
                    <div className="topic-count">{lineData.client}</div>
                  </div>
                  <div>
                    <div className="topic-count">传输专线</div>
                  </div>
                  <div>
                    <div className="topic-count">
                      {lineData.businessBandwidth}G
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
              <div className="line-equip">
                <div className="equip">
                  <span />
                  <span>A端传输设备：</span>
                  {/*<span>{lineData.abusinessEquipName}</span>*/}
                  <span>{abusinessEquipName}</span>
                </div>
                <div className="equip">
                  <span />
                  <span>Z端传输设备：</span>
                  {/*<span>{lineData.zbusinessEquipName}</span>*/}
                  <span>{zbusinessEquipName}</span>
                </div>
              </div>
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
          <div className="block2">
            {fromPage === 'network' && (
              <WarnModal
                title={`活动告警-${state.record.name}`}
                pathName={fromPage}
                warnSummary={warnSummary}
                warnCountValues={warnCountValues}
                warnList={warnList}
                pageNum={pageNum}
                pageSize={pageSize}
                totalCount={total}
                onPageChange={this.onPageChange}
              />
            )}
            {fromPage === 'business' && (
              <div className="tableChoose">
                <div className="line1">
                  {fromPage === 'business' && (
                    <p>活动告警-{state.record.name}</p>
                  )}
                  <div className="circle">
                    <div className="item">
                      <div className="comm">
                        <div className="top" />
                        <div className="right" />
                        <div className="bottom" />
                        <div className="left" />
                      </div>
                      <span>{formatNumber(warnSummary)}</span>
                    </div>
                    {[
                      { key: '1', color: '#FF6464' },
                      { key: '2', color: '#FFA85A' },
                      { key: '3', color: '#FFEC6F' },
                      { key: '4', color: '#8BBCFE' }
                    ].map((item, idx) => (
                      <div className="item" key={idx}>
                        <div
                          style={{ backgroundColor: `${item.color}` }}
                          className="comm"
                        />
                        <span>{formatNumber(warnCountValues[item.key])}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Table
                  columns={columns}
                  dataSource={warnList}
                  className="busifault-table"
                  rowKey={record => record.id}
                  pagination={false}
                />
                <TablePagination
                  {...{
                    total: total,
                    pageSize: pageSize,
                    pageNumber: pageNum,
                    handlePageChange: this.getTableData,
                    preventDefaultLoad: true
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
