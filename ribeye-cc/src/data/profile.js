import { bi } from './site.js';

/** Confirmed profile facts shared by the home page and CV. */
export const profile = {
  introduction: [
    bi('I am Chun-Jie Zhuang, a graduate of the M.S. Program in Artificial Intelligence Technology at National Taipei University of Technology. I conducted graduate research at the Robot Vision Lab, part of the CSIE Graduate Institute.', '我是莊淳傑，畢業於國立臺北科技大學人工智慧科技碩士學位學程，曾於資工所所屬的 Robot Vision Lab（機器人視覺實驗室）進行電腦視覺研究。'),
    bi('My interests include computer vision, vision-language models, video understanding, and computational geometry. I also enjoy building software for practical use.', '我的研究興趣包括電腦視覺、視覺語言模型、影片理解及幾何演算法；此外也喜歡開發實際可用的軟體工具。'),
  ],
  interests: bi('Computer vision; vision-language models; spatio-temporal video grounding; algorithm design; software engineering.', '電腦視覺；視覺語言模型；影片時空定位；演算法設計；軟體工程。'),
  education: [
    {
      period: '2024–2026',
      institution: bi('National Taipei University of Technology', '國立臺北科技大學'),
      degree: bi('M.S. in Artificial Intelligence Technology', '人工智慧科技碩士學位學程，碩士畢業'),
      shortDegree: bi('M.S., Artificial Intelligence Technology', '人工智慧科技碩士'),
      lab: bi('Robot Vision Lab, CSIE Graduate Institute', '機器人視覺實驗室（Robot Vision Lab），資工所'),
    },
    {
      period: '2019–2024',
      institution: bi('Chinese Culture University', '中國文化大學'),
      degree: bi('B.S. in Electrical Engineering', '電機工程學系，學士畢業'),
      shortDegree: bi('B.S., Electrical Engineering', '電機工程學士'),
    },
  ],
  researchAreas: ['Computer Vision', 'Voice Processing'],
  programmingLanguages: ['C', 'C++', 'Python', 'x86 assembly'],
  tools: ['Git', 'GitHub', 'Docker', 'ROS'],
  linuxExperience: bi('Comfortable working in Linux environments, with Arch Linux as my daily operating system and proficiency in command-line (CLI) workflows and TTY terminals. Model training for my master’s research was also completed remotely on rented data-center servers.', '熟悉 Linux 環境，日常使用 Arch Linux，並能熟練透過命令列介面（CLI）與 TTY 終端操作系統。碩士研究中的模型訓練亦透過遠端連線，於租用的資料中心主機上完成。'),
  toeic: '780 / 990',
};
