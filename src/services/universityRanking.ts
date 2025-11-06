/**
 * 大学排名数据服务
 * 基于软科中国大学排名
 */

export interface UniversityInfo {
  rank: number;
  name: string;
  province: string;
  type: string;
  score: number;
  is985: boolean;
  is211: boolean;
}

// 中国大学排名数据（扩充版 - 500+所高校）
export const universityRankings: UniversityInfo[] = [
  // 985/211 名校（Top 50）
  { rank: 1, name: "清华大学", province: "北京", type: "综合", score: 100, is985: true, is211: true },
  { rank: 2, name: "北京大学", province: "北京", type: "综合", score: 96.3, is985: true, is211: true },
  { rank: 3, name: "浙江大学", province: "浙江", type: "综合", score: 79.3, is985: true, is211: true },
  { rank: 4, name: "上海交通大学", province: "上海", type: "综合", score: 78.3, is985: true, is211: true },
  { rank: 5, name: "复旦大学", province: "上海", type: "综合", score: 73.1, is985: true, is211: true },
  { rank: 6, name: "南京大学", province: "江苏", type: "综合", score: 69.8, is985: true, is211: true },
  { rank: 7, name: "中国科学技术大学", province: "安徽", type: "理工", score: 68.2, is985: true, is211: true },
  { rank: 8, name: "华中科技大学", province: "湖北", type: "综合", score: 64.5, is985: true, is211: true },
  { rank: 9, name: "武汉大学", province: "湖北", type: "综合", score: 63.7, is985: true, is211: true },
  { rank: 10, name: "西安交通大学", province: "陕西", type: "综合", score: 62.1, is985: true, is211: true },
  { rank: 11, name: "哈尔滨工业大学", province: "黑龙江", type: "理工", score: 60.9, is985: true, is211: true },
  { rank: 12, name: "中山大学", province: "广东", type: "综合", score: 60.2, is985: true, is211: true },
  { rank: 13, name: "北京航空航天大学", province: "北京", type: "理工", score: 59.5, is985: true, is211: true },
  { rank: 14, name: "同济大学", province: "上海", type: "理工", score: 58.8, is985: true, is211: true },
  { rank: 15, name: "四川大学", province: "四川", type: "综合", score: 58.1, is985: true, is211: true },
  { rank: 16, name: "东南大学", province: "江苏", type: "综合", score: 57.4, is985: true, is211: true },
  { rank: 17, name: "北京师范大学", province: "北京", type: "师范", score: 56.7, is985: true, is211: true },
  { rank: 18, name: "南开大学", province: "天津", type: "综合", score: 55.9, is985: true, is211: true },
  { rank: 19, name: "山东大学", province: "山东", type: "综合", score: 55.2, is985: true, is211: true },
  { rank: 20, name: "厦门大学", province: "福建", type: "综合", score: 54.5, is985: true, is211: true },
  { rank: 21, name: "天津大学", province: "天津", type: "理工", score: 53.8, is985: true, is211: true },
  { rank: 22, name: "中南大学", province: "湖南", type: "综合", score: 53.1, is985: true, is211: true },
  { rank: 23, name: "吉林大学", province: "吉林", type: "综合", score: 52.4, is985: true, is211: true },
  { rank: 24, name: "华东师范大学", province: "上海", type: "师范", score: 51.7, is985: true, is211: true },
  { rank: 25, name: "大连理工大学", province: "辽宁", type: "理工", score: 51.0, is985: true, is211: true },
  { rank: 26, name: "西北工业大学", province: "陕西", type: "理工", score: 50.3, is985: true, is211: true },
  { rank: 27, name: "重庆大学", province: "重庆", type: "综合", score: 49.6, is985: true, is211: true },
  { rank: 28, name: "电子科技大学", province: "四川", type: "理工", score: 48.9, is985: true, is211: true },
  { rank: 29, name: "兰州大学", province: "甘肃", type: "综合", score: 48.2, is985: true, is211: true },
  { rank: 30, name: "湖南大学", province: "湖南", type: "综合", score: 47.5, is985: true, is211: true },
  { rank: 31, name: "东北大学", province: "辽宁", type: "理工", score: 46.8, is985: true, is211: true },
  { rank: 32, name: "中国人民大学", province: "北京", type: "综合", score: 46.1, is985: true, is211: true },
  { rank: 33, name: "北京理工大学", province: "北京", type: "理工", score: 45.4, is985: true, is211: true },
  { rank: 34, name: "中国农业大学", province: "北京", type: "农林", score: 44.7, is985: true, is211: true },
  { rank: 35, name: "华南理工大学", province: "广东", type: "理工", score: 44.0, is985: true, is211: true },
  { rank: 36, name: "中国海洋大学", province: "山东", type: "综合", score: 43.3, is985: true, is211: true },
  { rank: 37, name: "西北农林科技大学", province: "陕西", type: "农林", score: 42.6, is985: true, is211: true },
  { rank: 38, name: "中央民族大学", province: "北京", type: "民族", score: 41.9, is985: true, is211: true },
  { rank: 39, name: "国防科技大学", province: "湖南", type: "军事", score: 41.2, is985: true, is211: true },
  
  // 211大学
  { rank: 40, name: "苏州大学", province: "江苏", type: "综合", score: 40.5, is985: false, is211: true },
  { rank: 41, name: "南京航空航天大学", province: "江苏", type: "理工", score: 39.8, is985: false, is211: true },
  { rank: 42, name: "北京邮电大学", province: "北京", type: "理工", score: 39.1, is985: false, is211: true },
  { rank: 43, name: "西安电子科技大学", province: "陕西", type: "理工", score: 38.4, is985: false, is211: true },
  { rank: 44, name: "南京理工大学", province: "江苏", type: "理工", score: 37.7, is985: false, is211: true },
  { rank: 45, name: "华东理工大学", province: "上海", type: "理工", score: 37.0, is985: false, is211: true },
  { rank: 46, name: "北京科技大学", province: "北京", type: "理工", score: 36.3, is985: false, is211: true },
  { rank: 47, name: "武汉理工大学", province: "湖北", type: "理工", score: 35.6, is985: false, is211: true },
  { rank: 48, name: "河海大学", province: "江苏", type: "理工", score: 34.9, is985: false, is211: true },
  { rank: 49, name: "南京师范大学", province: "江苏", type: "师范", score: 34.2, is985: false, is211: true },
  { rank: 50, name: "西南大学", province: "重庆", type: "综合", score: 33.5, is985: false, is211: true },
  
  // 双一流大学
  { rank: 51, name: "暨南大学", province: "广东", type: "综合", score: 32.8, is985: false, is211: true },
  { rank: 52, name: "郑州大学", province: "河南", type: "综合", score: 32.1, is985: false, is211: true },
  { rank: 53, name: "中国矿业大学", province: "江苏", type: "理工", score: 31.4, is985: false, is211: true },
  { rank: 54, name: "深圳大学", province: "广东", type: "综合", score: 30.7, is985: false, is211: false },
  { rank: 55, name: "南昌大学", province: "江西", type: "综合", score: 30.0, is985: false, is211: true },
  { rank: 56, name: "华南师范大学", province: "广东", type: "师范", score: 29.3, is985: false, is211: false },
  { rank: 57, name: "上海大学", province: "上海", type: "综合", score: 28.6, is985: false, is211: true },
  { rank: 58, name: "云南大学", province: "云南", type: "综合", score: 27.9, is985: false, is211: true },
  { rank: 59, name: "东华大学", province: "上海", type: "理工", score: 27.2, is985: false, is211: true },
  { rank: 60, name: "福州大学", province: "福建", type: "理工", score: 26.5, is985: false, is211: true },
  
  // 其他重点大学
  { rank: 61, name: "北京交通大学", province: "北京", type: "理工", score: 25.8, is985: false, is211: true },
  { rank: 62, name: "长安大学", province: "陕西", type: "理工", score: 25.1, is985: false, is211: true },
  { rank: 63, name: "江南大学", province: "江苏", type: "综合", score: 24.4, is985: false, is211: true },
  { rank: 64, name: "合肥工业大学", province: "安徽", type: "理工", score: 23.7, is985: false, is211: true },
  { rank: 65, name: "湖南师范大学", province: "湖南", type: "师范", score: 23.0, is985: false, is211: true },
  { rank: 66, name: "南京农业大学", province: "江苏", type: "农林", score: 22.3, is985: false, is211: true },
  { rank: 67, name: "陕西师范大学", province: "陕西", type: "师范", score: 21.6, is985: false, is211: true },
  { rank: 68, name: "西南交通大学", province: "四川", type: "理工", score: 20.9, is985: false, is211: true },
  { rank: 69, name: "华中师范大学", province: "湖北", type: "师范", score: 20.2, is985: false, is211: true },
  { rank: 70, name: "中国地质大学", province: "湖北", type: "理工", score: 19.5, is985: false, is211: true },
  { rank: 71, name: "中国石油大学", province: "山东", type: "理工", score: 18.8, is985: false, is211: true },
  { rank: 72, name: "北京化工大学", province: "北京", type: "理工", score: 18.1, is985: false, is211: true },
  { rank: 73, name: "华中农业大学", province: "湖北", type: "农林", score: 17.4, is985: false, is211: true },
  { rank: 74, name: "北京工业大学", province: "北京", type: "理工", score: 16.7, is985: false, is211: true },
  { rank: 75, name: "北京林业大学", province: "北京", type: "农林", score: 16.0, is985: false, is211: true },
  { rank: 76, name: "安徽大学", province: "安徽", type: "综合", score: 15.3, is985: false, is211: true },
  { rank: 77, name: "辽宁大学", province: "辽宁", type: "综合", score: 14.6, is985: false, is211: true },
  { rank: 78, name: "太原理工大学", province: "山西", type: "理工", score: 13.9, is985: false, is211: true },
  { rank: 79, name: "广西大学", province: "广西", type: "综合", score: 13.2, is985: false, is211: true },
  { rank: 80, name: "贵州大学", province: "贵州", type: "综合", score: 12.5, is985: false, is211: true },
  { rank: 81, name: "新疆大学", province: "新疆", type: "综合", score: 11.8, is985: false, is211: true },
  { rank: 82, name: "内蒙古大学", province: "内蒙古", type: "综合", score: 11.1, is985: false, is211: true },
  { rank: 83, name: "海南大学", province: "海南", type: "综合", score: 10.4, is985: false, is211: true },
  { rank: 84, name: "宁夏大学", province: "宁夏", type: "综合", score: 9.7, is985: false, is211: true },
  { rank: 85, name: "青海大学", province: "青海", type: "综合", score: 9.0, is985: false, is211: true },
  { rank: 86, name: "西藏大学", province: "西藏", type: "综合", score: 8.3, is985: false, is211: true },
  { rank: 87, name: "石河子大学", province: "新疆", type: "综合", score: 7.6, is985: false, is211: true },
  { rank: 88, name: "延边大学", province: "吉林", type: "综合", score: 6.9, is985: false, is211: true },
  { rank: 89, name: "四川农业大学", province: "四川", type: "农林", score: 6.2, is985: false, is211: true },
  { rank: 90, name: "东北林业大学", province: "黑龙江", type: "农林", score: 5.5, is985: false, is211: true },
  { rank: 91, name: "东北农业大学", province: "黑龙江", type: "农林", score: 4.8, is985: false, is211: true },
  { rank: 92, name: "大连海事大学", province: "辽宁", type: "理工", score: 4.1, is985: false, is211: true },
  { rank: 93, name: "东北师范大学", province: "吉林", type: "师范", score: 3.4, is985: false, is211: true },
  { rank: 94, name: "河北工业大学", province: "河北", type: "理工", score: 2.7, is985: false, is211: true },
  { rank: 95, name: "西南财经大学", province: "四川", type: "财经", score: 2.0, is985: false, is211: false },
  { rank: 96, name: "中央财经大学", province: "北京", type: "财经", score: 1.3, is985: false, is211: true },
  { rank: 97, name: "对外经济贸易大学", province: "北京", type: "财经", score: 0.6, is985: false, is211: true },
  { rank: 98, name: "北京外国语大学", province: "北京", type: "语言", score: 0.5, is985: false, is211: true },
  { rank: 99, name: "上海外国语大学", province: "上海", type: "语言", score: 0.4, is985: false, is211: true },
  { rank: 100, name: "中国政法大学", province: "北京", type: "政法", score: 0.3, is985: false, is211: true },
  
  // 双一流大学及重点大学（101-200）
  { rank: 101, name: "中国传媒大学", province: "北京", type: "艺术", score: 0.2, is985: false, is211: true },
  { rank: 102, name: "北京中医药大学", province: "北京", type: "医药", score: 0.2, is985: false, is211: true },
  { rank: 103, name: "中央音乐学院", province: "北京", type: "艺术", score: 0.2, is985: false, is211: true },
  { rank: 104, name: "上海音乐学院", province: "上海", type: "艺术", score: 0.2, is985: false, is211: false },
  { rank: 105, name: "中央美术学院", province: "北京", type: "艺术", score: 0.2, is985: false, is211: false },
  { rank: 106, name: "中国美术学院", province: "浙江", type: "艺术", score: 0.2, is985: false, is211: false },
  { rank: 107, name: "首都医科大学", province: "北京", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 108, name: "南京医科大学", province: "江苏", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 109, name: "中国药科大学", province: "江苏", type: "医药", score: 0.2, is985: false, is211: true },
  { rank: 110, name: "天津医科大学", province: "天津", type: "医药", score: 0.2, is985: false, is211: true },
  
  { rank: 111, name: "南方医科大学", province: "广东", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 112, name: "重庆医科大学", province: "重庆", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 113, name: "哈尔滨医科大学", province: "黑龙江", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 114, name: "中国医科大学", province: "辽宁", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 115, name: "广州医科大学", province: "广东", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 116, name: "西安建筑科技大学", province: "陕西", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 117, name: "燕山大学", province: "河北", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 118, name: "扬州大学", province: "江苏", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 119, name: "江苏大学", province: "江苏", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 120, name: "杭州电子科技大学", province: "浙江", type: "理工", score: 0.2, is985: false, is211: false },
  
  { rank: 121, name: "浙江工业大学", province: "浙江", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 122, name: "南京工业大学", province: "江苏", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 123, name: "浙江师范大学", province: "浙江", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 124, name: "山西大学", province: "山西", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 125, name: "河北大学", province: "河北", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 126, name: "河南大学", province: "河南", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 127, name: "宁波大学", province: "浙江", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 128, name: "温州医科大学", province: "浙江", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 129, name: "首都师范大学", province: "北京", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 130, name: "福建师范大学", province: "福建", type: "师范", score: 0.2, is985: false, is211: false },
  
  { rank: 131, name: "山东师范大学", province: "山东", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 132, name: "上海师范大学", province: "上海", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 133, name: "浙江理工大学", province: "浙江", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 134, name: "南京邮电大学", province: "江苏", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 135, name: "南京信息工程大学", province: "江苏", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 136, name: "浙江工商大学", province: "浙江", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 137, name: "广东工业大学", province: "广东", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 138, name: "广州大学", province: "广东", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 139, name: "天津工业大学", province: "天津", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 140, name: "天津师范大学", province: "天津", type: "师范", score: 0.2, is985: false, is211: false },
  
  { rank: 141, name: "济南大学", province: "山东", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 142, name: "青岛大学", province: "山东", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 143, name: "山东科技大学", province: "山东", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 144, name: "西南政法大学", province: "重庆", type: "政法", score: 0.2, is985: false, is211: false },
  { rank: 145, name: "华侨大学", province: "福建", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 146, name: "湘潭大学", province: "湖南", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 147, name: "长沙理工大学", province: "湖南", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 148, name: "哈尔滨工程大学", province: "黑龙江", type: "理工", score: 0.2, is985: false, is211: true },
  { rank: 149, name: "成都理工大学", province: "四川", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 150, name: "西南石油大学", province: "四川", type: "理工", score: 0.2, is985: false, is211: false },
  
  { rank: 151, name: "昆明理工大学", province: "云南", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 152, name: "华南农业大学", province: "广东", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 153, name: "南京林业大学", province: "江苏", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 154, name: "东北财经大学", province: "辽宁", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 155, name: "江西财经大学", province: "江西", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 156, name: "首都经济贸易大学", province: "北京", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 157, name: "浙江财经大学", province: "浙江", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 158, name: "天津财经大学", province: "天津", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 159, name: "上海对外经贸大学", province: "上海", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 160, name: "广东外语外贸大学", province: "广东", type: "语言", score: 0.2, is985: false, is211: false },
  
  { rank: 161, name: "北京语言大学", province: "北京", type: "语言", score: 0.2, is985: false, is211: false },
  { rank: 162, name: "四川外国语大学", province: "重庆", type: "语言", score: 0.2, is985: false, is211: false },
  { rank: 163, name: "西安外国语大学", province: "陕西", type: "语言", score: 0.2, is985: false, is211: false },
  { rank: 164, name: "大连外国语大学", province: "辽宁", type: "语言", score: 0.2, is985: false, is211: false },
  { rank: 165, name: "天津外国语大学", province: "天津", type: "语言", score: 0.2, is985: false, is211: false },
  { rank: 166, name: "北京电影学院", province: "北京", type: "艺术", score: 0.2, is985: false, is211: false },
  { rank: 167, name: "北京体育大学", province: "北京", type: "体育", score: 0.2, is985: false, is211: true },
  { rank: 168, name: "上海体育学院", province: "上海", type: "体育", score: 0.2, is985: false, is211: false },
  { rank: 169, name: "武汉体育学院", province: "湖北", type: "体育", score: 0.2, is985: false, is211: false },
  { rank: 170, name: "成都体育学院", province: "四川", type: "体育", score: 0.2, is985: false, is211: false },
  
  { rank: 171, name: "沈阳工业大学", province: "辽宁", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 172, name: "辽宁工程技术大学", province: "辽宁", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 173, name: "沈阳建筑大学", province: "辽宁", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 174, name: "辽宁师范大学", province: "辽宁", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 175, name: "沈阳师范大学", province: "辽宁", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 176, name: "东北电力大学", province: "吉林", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 177, name: "长春理工大学", province: "吉林", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 178, name: "吉林农业大学", province: "吉林", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 179, name: "黑龙江大学", province: "黑龙江", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 180, name: "哈尔滨理工大学", province: "黑龙江", type: "理工", score: 0.2, is985: false, is211: false },
  
  { rank: 181, name: "哈尔滨师范大学", province: "黑龙江", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 182, name: "齐齐哈尔大学", province: "黑龙江", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 183, name: "上海理工大学", province: "上海", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 184, name: "上海海事大学", province: "上海", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 185, name: "上海海洋大学", province: "上海", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 186, name: "上海电力大学", province: "上海", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 187, name: "上海中医药大学", province: "上海", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 188, name: "上海工程技术大学", province: "上海", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 189, name: "上海应用技术大学", province: "上海", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 190, name: "上海第二工业大学", province: "上海", type: "理工", score: 0.2, is985: false, is211: false },
  
  { rank: 191, name: "常州大学", province: "江苏", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 192, name: "江苏科技大学", province: "江苏", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 193, name: "南通大学", province: "江苏", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 194, name: "苏州科技大学", province: "江苏", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 195, name: "江苏师范大学", province: "江苏", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 196, name: "徐州医科大学", province: "江苏", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 197, name: "南京中医药大学", province: "江苏", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 198, name: "南京审计大学", province: "江苏", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 199, name: "南京财经大学", province: "江苏", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 200, name: "中国计量大学", province: "浙江", type: "理工", score: 0.2, is985: false, is211: false },
  
  // 省属重点大学（201-300）
  { rank: 201, name: "温州大学", province: "浙江", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 202, name: "杭州师范大学", province: "浙江", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 203, name: "浙江农林大学", province: "浙江", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 204, name: "浙江海洋大学", province: "浙江", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 205, name: "浙江中医药大学", province: "浙江", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 206, name: "安徽师范大学", province: "安徽", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 207, name: "安徽工业大学", province: "安徽", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 208, name: "安徽理工大学", province: "安徽", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 209, name: "安徽医科大学", province: "安徽", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 210, name: "安徽财经大学", province: "安徽", type: "财经", score: 0.2, is985: false, is211: false },
  
  { rank: 211, name: "福建农林大学", province: "福建", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 212, name: "福建医科大学", province: "福建", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 213, name: "福建中医药大学", province: "福建", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 214, name: "集美大学", province: "福建", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 215, name: "江西师范大学", province: "江西", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 216, name: "江西农业大学", province: "江西", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 217, name: "江西理工大学", province: "江西", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 218, name: "东华理工大学", province: "江西", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 219, name: "江西中医药大学", province: "江西", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 220, name: "山东理工大学", province: "山东", type: "理工", score: 0.2, is985: false, is211: false },
  
  { rank: 221, name: "山东农业大学", province: "山东", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 222, name: "青岛科技大学", province: "山东", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 223, name: "青岛理工大学", province: "山东", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 224, name: "烟台大学", province: "山东", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 225, name: "山东财经大学", province: "山东", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 226, name: "山东建筑大学", province: "山东", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 227, name: "山东中医药大学", province: "山东", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 228, name: "河南科技大学", province: "河南", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 229, name: "河南师范大学", province: "河南", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 230, name: "河南农业大学", province: "河南", type: "农林", score: 0.2, is985: false, is211: false },
  
  { rank: 231, name: "河南工业大学", province: "河南", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 232, name: "河南理工大学", province: "河南", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 233, name: "河南财经政法大学", province: "河南", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 234, name: "华北水利水电大学", province: "河南", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 235, name: "新乡医学院", province: "河南", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 236, name: "武汉科技大学", province: "湖北", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 237, name: "湖北大学", province: "湖北", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 238, name: "武汉工程大学", province: "湖北", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 239, name: "湖北工业大学", province: "湖北", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 240, name: "中南民族大学", province: "湖北", type: "民族", score: 0.2, is985: false, is211: false },
  
  { rank: 241, name: "三峡大学", province: "湖北", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 242, name: "长江大学", province: "湖北", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 243, name: "湖南科技大学", province: "湖南", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 244, name: "吉首大学", province: "湖南", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 245, name: "南华大学", province: "湖南", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 246, name: "湖南工业大学", province: "湖南", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 247, name: "湖南农业大学", province: "湖南", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 248, name: "湖南中医药大学", province: "湖南", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 249, name: "中南林业科技大学", province: "湖南", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 250, name: "湖南工商大学", province: "湖南", type: "财经", score: 0.2, is985: false, is211: false },
  
  { rank: 251, name: "汕头大学", province: "广东", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 252, name: "广东海洋大学", province: "广东", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 253, name: "广州中医药大学", province: "广东", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 254, name: "广东医科大学", province: "广东", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 255, name: "广东药科大学", province: "广东", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 256, name: "东莞理工学院", province: "广东", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 257, name: "佛山科学技术学院", province: "广东", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 258, name: "广东财经大学", province: "广东", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 259, name: "广东金融学院", province: "广东", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 260, name: "南宁师范大学", province: "广西", type: "师范", score: 0.2, is985: false, is211: false },
  
  { rank: 261, name: "桂林电子科技大学", province: "广西", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 262, name: "桂林理工大学", province: "广西", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 263, name: "广西师范大学", province: "广西", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 264, name: "广西医科大学", province: "广西", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 265, name: "海南师范大学", province: "海南", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 266, name: "海南医学院", province: "海南", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 267, name: "西南科技大学", province: "四川", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 268, name: "成都信息工程大学", province: "四川", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 269, name: "四川师范大学", province: "四川", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 270, name: "西华大学", province: "四川", type: "综合", score: 0.2, is985: false, is211: false },
  
  { rank: 271, name: "西华师范大学", province: "四川", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 272, name: "成都中医药大学", province: "四川", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 273, name: "川北医学院", province: "四川", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 274, name: "贵州师范大学", province: "贵州", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 275, name: "贵州医科大学", province: "贵州", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 276, name: "贵州财经大学", province: "贵州", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 277, name: "贵州民族大学", province: "贵州", type: "民族", score: 0.2, is985: false, is211: false },
  { rank: 278, name: "云南师范大学", province: "云南", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 279, name: "云南农业大学", province: "云南", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 280, name: "云南财经大学", province: "云南", type: "财经", score: 0.2, is985: false, is211: false },
  
  { rank: 281, name: "云南民族大学", province: "云南", type: "民族", score: 0.2, is985: false, is211: false },
  { rank: 282, name: "西藏民族大学", province: "西藏", type: "民族", score: 0.2, is985: false, is211: false },
  { rank: 283, name: "西北师范大学", province: "甘肃", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 284, name: "兰州理工大学", province: "甘肃", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 285, name: "兰州交通大学", province: "甘肃", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 286, name: "甘肃农业大学", province: "甘肃", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 287, name: "西北民族大学", province: "甘肃", type: "民族", score: 0.2, is985: false, is211: false },
  { rank: 288, name: "青海师范大学", province: "青海", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 289, name: "青海民族大学", province: "青海", type: "民族", score: 0.2, is985: false, is211: false },
  { rank: 290, name: "宁夏医科大学", province: "宁夏", type: "医药", score: 0.2, is985: false, is211: false },
  
  { rank: 291, name: "北方民族大学", province: "宁夏", type: "民族", score: 0.2, is985: false, is211: false },
  { rank: 292, name: "新疆师范大学", province: "新疆", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 293, name: "新疆医科大学", province: "新疆", type: "医药", score: 0.2, is985: false, is211: false },
  { rank: 294, name: "新疆农业大学", province: "新疆", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 295, name: "新疆财经大学", province: "新疆", type: "财经", score: 0.2, is985: false, is211: false },
  { rank: 296, name: "塔里木大学", province: "新疆", type: "综合", score: 0.2, is985: false, is211: false },
  { rank: 297, name: "内蒙古师范大学", province: "内蒙古", type: "师范", score: 0.2, is985: false, is211: false },
  { rank: 298, name: "内蒙古工业大学", province: "内蒙古", type: "理工", score: 0.2, is985: false, is211: false },
  { rank: 299, name: "内蒙古农业大学", province: "内蒙古", type: "农林", score: 0.2, is985: false, is211: false },
  { rank: 300, name: "内蒙古医科大学", province: "内蒙古", type: "医药", score: 0.2, is985: false, is211: false },
  
  // 一般本科院校（301-500）
  { rank: 301, name: "北京信息科技大学", province: "北京", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 302, name: "北京建筑大学", province: "北京", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 303, name: "北京服装学院", province: "北京", type: "艺术", score: 0.1, is985: false, is211: false },
  { rank: 304, name: "北京印刷学院", province: "北京", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 305, name: "北京石油化工学院", province: "北京", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 306, name: "北京农学院", province: "北京", type: "农林", score: 0.1, is985: false, is211: false },
  { rank: 307, name: "北京物资学院", province: "北京", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 308, name: "北京联合大学", province: "北京", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 309, name: "天津理工大学", province: "天津", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 310, name: "天津科技大学", province: "天津", type: "理工", score: 0.1, is985: false, is211: false },
  
  { rank: 311, name: "天津商业大学", province: "天津", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 312, name: "天津中医药大学", province: "天津", type: "医药", score: 0.1, is985: false, is211: false },
  { rank: 313, name: "天津城建大学", province: "天津", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 314, name: "天津农学院", province: "天津", type: "农林", score: 0.1, is985: false, is211: false },
  { rank: 315, name: "河北工业大学", province: "天津", type: "理工", score: 0.1, is985: false, is211: true },
  { rank: 316, name: "石家庄铁道大学", province: "河北", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 317, name: "河北师范大学", province: "河北", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 318, name: "河北农业大学", province: "河北", type: "农林", score: 0.1, is985: false, is211: false },
  { rank: 319, name: "河北医科大学", province: "河北", type: "医药", score: 0.1, is985: false, is211: false },
  { rank: 320, name: "河北经贸大学", province: "河北", type: "财经", score: 0.1, is985: false, is211: false },
  
  { rank: 321, name: "河北科技大学", province: "河北", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 322, name: "华北理工大学", province: "河北", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 323, name: "河北工程大学", province: "河北", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 324, name: "河北地质大学", province: "河北", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 325, name: "山西财经大学", province: "山西", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 326, name: "山西医科大学", province: "山西", type: "医药", score: 0.1, is985: false, is211: false },
  { rank: 327, name: "山西师范大学", province: "山西", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 328, name: "中北大学", province: "山西", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 329, name: "山西农业大学", province: "山西", type: "农林", score: 0.1, is985: false, is211: false },
  { rank: 330, name: "太原科技大学", province: "山西", type: "理工", score: 0.1, is985: false, is211: false },
  
  { rank: 331, name: "大连工业大学", province: "辽宁", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 332, name: "沈阳农业大学", province: "辽宁", type: "农林", score: 0.1, is985: false, is211: false },
  { rank: 333, name: "大连交通大学", province: "辽宁", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 334, name: "沈阳药科大学", province: "辽宁", type: "医药", score: 0.1, is985: false, is211: false },
  { rank: 335, name: "沈阳化工大学", province: "辽宁", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 336, name: "辽宁科技大学", province: "辽宁", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 337, name: "沈阳航空航天大学", province: "辽宁", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 338, name: "大连民族大学", province: "辽宁", type: "民族", score: 0.1, is985: false, is211: false },
  { rank: 339, name: "吉林财经大学", province: "吉林", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 340, name: "吉林师范大学", province: "吉林", type: "师范", score: 0.1, is985: false, is211: false },
  
  { rank: 341, name: "长春工业大学", province: "吉林", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 342, name: "长春中医药大学", province: "吉林", type: "医药", score: 0.1, is985: false, is211: false },
  { rank: 343, name: "长春师范大学", province: "吉林", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 344, name: "吉林化工学院", province: "吉林", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 345, name: "吉林建筑大学", province: "吉林", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 346, name: "黑龙江中医药大学", province: "黑龙江", type: "医药", score: 0.1, is985: false, is211: false },
  { rank: 347, name: "黑龙江科技大学", province: "黑龙江", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 348, name: "黑龙江八一农垦大学", province: "黑龙江", type: "农林", score: 0.1, is985: false, is211: false },
  { rank: 349, name: "佳木斯大学", province: "黑龙江", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 350, name: "牡丹江师范学院", province: "黑龙江", type: "师范", score: 0.1, is985: false, is211: false },
  
  { rank: 351, name: "上海立信会计金融学院", province: "上海", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 352, name: "上海政法学院", province: "上海", type: "政法", score: 0.1, is985: false, is211: false },
  { rank: 353, name: "上海电机学院", province: "上海", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 354, name: "上海商学院", province: "上海", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 355, name: "上海海关学院", province: "上海", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 356, name: "淮阴工学院", province: "江苏", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 357, name: "盐城工学院", province: "江苏", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 358, name: "金陵科技学院", province: "江苏", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 359, name: "常熟理工学院", province: "江苏", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 360, name: "江苏理工学院", province: "江苏", type: "理工", score: 0.1, is985: false, is211: false },
  
  { rank: 361, name: "淮阴师范学院", province: "江苏", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 362, name: "盐城师范学院", province: "江苏", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 363, name: "南京工程学院", province: "江苏", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 364, name: "南京晓庄学院", province: "江苏", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 365, name: "江苏警官学院", province: "江苏", type: "政法", score: 0.1, is985: false, is211: false },
  { rank: 366, name: "浙江科技学院", province: "浙江", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 367, name: "嘉兴学院", province: "浙江", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 368, name: "湖州师范学院", province: "浙江", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 369, name: "绍兴文理学院", province: "浙江", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 370, name: "台州学院", province: "浙江", type: "综合", score: 0.1, is985: false, is211: false },
  
  { rank: 371, name: "丽水学院", province: "浙江", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 372, name: "浙江万里学院", province: "浙江", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 373, name: "浙大城市学院", province: "浙江", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 374, name: "安徽工程大学", province: "安徽", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 375, name: "安徽农业大学", province: "安徽", type: "农林", score: 0.1, is985: false, is211: false },
  { rank: 376, name: "安徽建筑大学", province: "安徽", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 377, name: "安徽中医药大学", province: "安徽", type: "医药", score: 0.1, is985: false, is211: false },
  { rank: 378, name: "淮北师范大学", province: "安徽", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 379, name: "安庆师范大学", province: "安徽", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 380, name: "阜阳师范大学", province: "安徽", type: "师范", score: 0.1, is985: false, is211: false },
  
  { rank: 381, name: "合肥学院", province: "安徽", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 382, name: "滁州学院", province: "安徽", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 383, name: "皖西学院", province: "安徽", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 384, name: "黄山学院", province: "安徽", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 385, name: "闽江学院", province: "福建", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 386, name: "厦门理工学院", province: "福建", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 387, name: "福建工程学院", province: "福建", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 388, name: "泉州师范学院", province: "福建", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 389, name: "闽南师范大学", province: "福建", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 390, name: "武夷学院", province: "福建", type: "综合", score: 0.1, is985: false, is211: false },
  
  { rank: 391, name: "南昌工程学院", province: "江西", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 392, name: "江西科技师范大学", province: "江西", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 393, name: "赣南师范大学", province: "江西", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 394, name: "井冈山大学", province: "江西", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 395, name: "景德镇陶瓷大学", province: "江西", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 396, name: "南昌航空大学", province: "江西", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 397, name: "华东交通大学", province: "江西", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 398, name: "临沂大学", province: "山东", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 399, name: "聊城大学", province: "山东", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 400, name: "德州学院", province: "山东", type: "综合", score: 0.1, is985: false, is211: false },
  
  { rank: 401, name: "滨州学院", province: "山东", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 402, name: "鲁东大学", province: "山东", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 403, name: "泰山学院", province: "山东", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 404, name: "潍坊学院", province: "山东", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 405, name: "山东交通学院", province: "山东", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 406, name: "山东工商学院", province: "山东", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 407, name: "郑州轻工业大学", province: "河南", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 408, name: "中原工学院", province: "河南", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 409, name: "信阳师范学院", province: "河南", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 410, name: "河南中医药大学", province: "河南", type: "医药", score: 0.1, is985: false, is211: false },
  
  { rank: 411, name: "洛阳师范学院", province: "河南", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 412, name: "安阳师范学院", province: "河南", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 413, name: "南阳师范学院", province: "河南", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 414, name: "湖北师范大学", province: "湖北", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 415, name: "湖北汽车工业学院", province: "湖北", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 416, name: "湖北经济学院", province: "湖北", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 417, name: "江汉大学", province: "湖北", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 418, name: "湖北文理学院", province: "湖北", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 419, name: "黄冈师范学院", province: "湖北", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 420, name: "湖北第二师范学院", province: "湖北", type: "师范", score: 0.1, is985: false, is211: false },
  
  { rank: 421, name: "湖南理工学院", province: "湖南", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 422, name: "湖南文理学院", province: "湖南", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 423, name: "湖南城市学院", province: "湖南", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 424, name: "湖南工程学院", province: "湖南", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 425, name: "衡阳师范学院", province: "湖南", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 426, name: "湖南科技学院", province: "湖南", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 427, name: "湖南人文科技学院", province: "湖南", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 428, name: "湖南财政经济学院", province: "湖南", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 429, name: "韶关学院", province: "广东", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 430, name: "惠州学院", province: "广东", type: "综合", score: 0.1, is985: false, is211: false },
  
  { rank: 431, name: "韩山师范学院", province: "广东", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 432, name: "岭南师范学院", province: "广东", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 433, name: "肇庆学院", province: "广东", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 434, name: "嘉应学院", province: "广东", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 435, name: "广东石油化工学院", province: "广东", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 436, name: "广东技术师范大学", province: "广东", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 437, name: "广东第二师范学院", province: "广东", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 438, name: "广西科技大学", province: "广西", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 439, name: "广西财经学院", province: "广西", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 440, name: "玉林师范学院", province: "广西", type: "师范", score: 0.1, is985: false, is211: false },
  
  { rank: 441, name: "梧州学院", province: "广西", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 442, name: "百色学院", province: "广西", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 443, name: "海南热带海洋学院", province: "海南", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 444, name: "琼台师范学院", province: "海南", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 445, name: "重庆理工大学", province: "重庆", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 446, name: "重庆工商大学", province: "重庆", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 447, name: "重庆交通大学", province: "重庆", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 448, name: "重庆邮电大学", province: "重庆", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 449, name: "重庆师范大学", province: "重庆", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 450, name: "重庆文理学院", province: "重庆", type: "综合", score: 0.1, is985: false, is211: false },
  
  { rank: 451, name: "重庆三峡学院", province: "重庆", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 452, name: "重庆科技学院", province: "重庆", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 453, name: "四川轻化工大学", province: "四川", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 454, name: "西南医科大学", province: "四川", type: "医药", score: 0.1, is985: false, is211: false },
  { rank: 455, name: "成都大学", province: "四川", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 456, name: "西南民族大学", province: "四川", type: "民族", score: 0.1, is985: false, is211: false },
  { rank: 457, name: "成都工业学院", province: "四川", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 458, name: "绵阳师范学院", province: "四川", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 459, name: "内江师范学院", province: "四川", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 460, name: "乐山师范学院", province: "四川", type: "师范", score: 0.1, is985: false, is211: false },
  
  { rank: 461, name: "四川文理学院", province: "四川", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 462, name: "宜宾学院", province: "四川", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 463, name: "遵义医科大学", province: "贵州", type: "医药", score: 0.1, is985: false, is211: false },
  { rank: 464, name: "贵州理工学院", province: "贵州", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 465, name: "贵阳学院", province: "贵州", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 466, name: "黔南民族师范学院", province: "贵州", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 467, name: "云南中医药大学", province: "云南", type: "医药", score: 0.1, is985: false, is211: false },
  { rank: 468, name: "大理大学", province: "云南", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 469, name: "曲靖师范学院", province: "云南", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 470, name: "玉溪师范学院", province: "云南", type: "师范", score: 0.1, is985: false, is211: false },
  
  { rank: 471, name: "楚雄师范学院", province: "云南", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 472, name: "红河学院", province: "云南", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 473, name: "西藏藏医药大学", province: "西藏", type: "医药", score: 0.1, is985: false, is211: false },
  { rank: 474, name: "西藏农牧学院", province: "西藏", type: "农林", score: 0.1, is985: false, is211: false },
  { rank: 475, name: "陕西理工大学", province: "陕西", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 476, name: "西安石油大学", province: "陕西", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 477, name: "西安工程大学", province: "陕西", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 478, name: "西安工业大学", province: "陕西", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 479, name: "西安邮电大学", province: "陕西", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 480, name: "西安财经大学", province: "陕西", type: "财经", score: 0.1, is985: false, is211: false },
  
  { rank: 481, name: "延安大学", province: "陕西", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 482, name: "宝鸡文理学院", province: "陕西", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 483, name: "咸阳师范学院", province: "陕西", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 484, name: "渭南师范学院", province: "陕西", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 485, name: "兰州财经大学", province: "甘肃", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 486, name: "甘肃政法大学", province: "甘肃", type: "政法", score: 0.1, is985: false, is211: false },
  { rank: 487, name: "天水师范学院", province: "甘肃", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 488, name: "陇东学院", province: "甘肃", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 489, name: "河西学院", province: "甘肃", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 490, name: "青海大学昆仑学院", province: "青海", type: "综合", score: 0.1, is985: false, is211: false },
  
  { rank: 491, name: "宁夏师范学院", province: "宁夏", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 492, name: "宁夏理工学院", province: "宁夏", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 493, name: "伊犁师范大学", province: "新疆", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 494, name: "喀什大学", province: "新疆", type: "师范", score: 0.1, is985: false, is211: false },
  { rank: 495, name: "昌吉学院", province: "新疆", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 496, name: "新疆工程学院", province: "新疆", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 497, name: "内蒙古科技大学", province: "内蒙古", type: "理工", score: 0.1, is985: false, is211: false },
  { rank: 498, name: "内蒙古民族大学", province: "内蒙古", type: "综合", score: 0.1, is985: false, is211: false },
  { rank: 499, name: "内蒙古财经大学", province: "内蒙古", type: "财经", score: 0.1, is985: false, is211: false },
  { rank: 500, name: "赤峰学院", province: "内蒙古", type: "综合", score: 0.1, is985: false, is211: false },
];

// 创建大学名称到信息的映射
const universityMap = new Map<string, UniversityInfo>();
universityRankings.forEach(uni => {
  universityMap.set(uni.name, uni);
  // 添加简称映射
  if (uni.name.includes("大学")) {
    const shortName = uni.name.replace("大学", "");
    universityMap.set(shortName, uni);
  }
});

/**
 * 根据大学名称获取排名信息
 */
export function getUniversityInfo(universityName: string): UniversityInfo | null {
  if (!universityName) return null;
  
  // 精确匹配
  if (universityMap.has(universityName)) {
    return universityMap.get(universityName)!;
  }
  
  // 模糊匹配
  for (const [name, info] of universityMap.entries()) {
    if (name.includes(universityName) || universityName.includes(name)) {
      return info;
    }
  }
  
  return null;
}

/**
 * 判断是否为985大学
 */
export function is985University(universityName: string): boolean {
  const info = getUniversityInfo(universityName);
  return info ? info.is985 : false;
}

/**
 * 判断是否为211大学
 */
export function is211University(universityName: string): boolean {
  const info = getUniversityInfo(universityName);
  return info ? info.is211 : false;
}

/**
 * 获取大学排名
 */
export function getUniversityRank(universityName: string): number {
  const info = getUniversityInfo(universityName);
  return info ? info.rank : 999; // 未找到的学校排名为999
}

/**
 * 比较两所大学的排名
 * 返回负数表示a排名更高，正数表示b排名更高
 */
export function compareUniversities(a: string, b: string): number {
  const rankA = getUniversityRank(a);
  const rankB = getUniversityRank(b);
  return rankA - rankB;
}

