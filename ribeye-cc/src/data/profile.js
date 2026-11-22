import { bi } from './site.js';

/** Confirmed profile facts shared by the home page and CV. */
export const profile = {
  introduction: [
    bi('I am Chun-Jie Zhuang, a graduate of the M.S. Program in Artificial Intelligence Technology at National Taipei University of Technology. During my master’s studies, I conducted research on computer vision and UR-series robotic arms at the Robot Vision Lab in the Department of Computer Science and Information Engineering.', '我是莊淳傑，畢業於國立臺北科技大學人工智慧科技碩士學位學程。碩士期間曾於資工系所屬的 Robot Vision Lab（機器人視覺實驗室）從事電腦視覺與 UR 系列機械手臂相關研究。'),
    bi('My research interests include computer vision, fine-tuning multimodal language models, and image processing. I also enjoy building practical software tools to solve problems I encounter in everyday life.', '我的研究興趣包括電腦視覺、多模態語言模型微調與影像處理。此外，我也喜歡開發實用的軟體工具，解決日常生活中遇到的問題。'),
  ],
  interests: bi('Computer vision; fine-tuning multimodal language models; image processing.', '電腦視覺；多模態語言模型微調；影像處理。'),
  education: [
    {
      period: '2024–2026',
      institution: bi('National Taipei University of Technology', '國立臺北科技大學'),
      degree: bi('M.S. Program in Artificial Intelligence Technology', '人工智慧科技碩士學位學程'),
      shortDegree: bi('M.S. Program in Artificial Intelligence Technology', '人工智慧科技碩士學位學程'),
      lab: bi('Robot Vision Lab, Department of Computer Science and Information Engineering', '機器人視覺實驗室（Robot Vision Lab），資工系'),
    },
    {
      period: '2019–2024',
      institution: bi('Chinese Culture University', '中國文化大學'),
      degree: bi('Department of Electrical Engineering', '電機工程學系'),
      shortDegree: bi('Department of Electrical Engineering', '電機工程學系'),
    },
    {
      period: '2017–2019',
      institution: bi('National Wu-Ling Senior High School', '國立武陵高級中學'),
      degree: bi('', ''),
      shortDegree: bi('', ''),
    },
  ],
  researchAreas: ['Computer Vision', 'Voice Processing'],
  programmingLanguages: ['C', 'C++', 'Python', 'x86 assembly'],
  tools: ['Git', 'GitHub', 'Docker', 'ROS'],
  linuxExperience: bi('Comfortable working in Linux environments, with Arch Linux as my daily operating system and proficiency in command-line (CLI) workflows and TTY terminals. Model training for my master’s research was also completed remotely on rented data-center servers.', '熟悉 Linux 環境，日常使用 Arch Linux，並能熟練透過命令列介面（CLI）與 TTY 終端操作系統。碩士研究中的模型訓練亦透過遠端連線，於租用的資料中心主機上完成。'),
  toeic: '780 / 990',
};
