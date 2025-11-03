// 这是一段使用 Web Audio API + Canvas 绘制音频波形并播放音频的示例页面。
// 目标：
// - 把一个 mp3 文件加载到浏览器内存中
// - 显示一条“静态”的完整波形（用于大画布）
// - 在右上角小窗口里显示“动态”的实时波形（随着播放变化）
// - 提供开始/停止按钮控制播放，同时在大画布上显示播放进度
// 提示：不需要懂音频原理，只要把它理解为“把声音数据变成一条线画在画布上”。
import { useEffect, useRef, useState } from "react";
import videoDemo from './4.mp3'
import styles from './index.less';

export default () => {
  // Ref 可以把一些跨渲染周期需要保留的对象和状态“放在盒子里”保存起来。
  // 比如这里的音频上下文、音频数据、播放节点等等，组件刷新也不会丢。
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const javascriptNodeRef = useRef<ScriptProcessorNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number>(0);
  
  // 存储“波形的高度数据”（把声音高低转成 0~255 的整数，用来画图）
  const waveformDataRef = useRef<Uint8Array | null>(null);
  // 存储“静态波形”的一份拷贝（对应整首歌的整体形状，用于大画布）
  const staticWaveformDataRef = useRef<Uint8Array | null>(null);
  
  // 状态管理
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>("Loading audio...");

  useEffect(() => {
    // 1) 获取页面上的几个关键元素：提示区、按钮、两个画布
    const msg: any = document.querySelector("output");
    const startBtn: any = document.querySelector("#start_button");
    const stopBtn: any = document.querySelector("#stop_button");
    const canvasElt: any = document.querySelector("#canvas");
    // 右上角小窗口画布：用来画“实时变化的波形”
    const miniCanvasElt: any = document.querySelector("#mini_canvas");

    if (!startBtn || !stopBtn || !canvasElt || !miniCanvasElt) {
      return;
    }

    // 2) 准备音频播放：创建音频上下文（浏览器里处理声音的“指挥中心”）
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    // 3) 加载音频文件（把 mp3 下载到内存里，并解码成可播放的数据）
    fetch(videoDemo)
      // 将网络响应的主体读取为 ArrayBuffer（纯二进制字节数据）。这是把 mp3 文件“原封不动”读进内存的形式。
      // 依然返回 Promise，resolve 的值是 ArrayBuffer。
      .then((response) => response.arrayBuffer())
      // 使用 Web Audio API 的 AudioContext.decodeAudioData 对压缩的音频数据（mp3、aac 等）进行解码，得到可直接播放的 AudioBuffer。
      // 这一步把“压缩格式字节流”变成了“PCM 采样数据”的内存结构，后续可交给音频节点播放或做波形计算。
      // 返回 Promise，resolve 的值是 AudioBuffer
      .then((downloadedBuffer) =>
        audioContext.decodeAudioData(downloadedBuffer)
      )
      // 进入成功回调，参数 decodedBuffer 就是完成解码的 AudioBuffer。
      .then((decodedBuffer) => {
        // 把 AudioBuffer 存入 useRef，便于后续播放、分析或绘图时随取随用。
        // 用 ref 而不是 state 是为了避免触发额外渲染，也因为这是大型不可序列化对象。
        audioBufferRef.current = decodedBuffer;
        // 更新 UI 提示：音频加载完成，提示点击开始按钮播放。
        setStatusMessage("Audio loaded. Click Start to play.");
        // 关闭加载态，UI 可以从 “Loading...” 切换到可交互状态。
        setIsLoading(false);
        // 4) 分析器节点：把声音“切片”成一段段数字，方便我们读取做可视化
        const analyserNode = new AnalyserNode(audioContext, {
          fftSize: 2048,
          smoothingTimeConstant: 0.8,
        });
        analyserNodeRef.current = analyserNode;
        
        // 5) 创建一个“临时音源”，只用来把整段音频的数据送进分析器，
        //    目的是计算出“整首歌的静态波形”，这里并不真正播放声音。
        const tempSourceNode = new AudioBufferSourceNode(audioContext, {
          buffer: decodedBuffer,
        });
        
        tempSourceNode.connect(analyserNode);
        
        // 6) 创建一个数组，用来接收分析器算出来的波形高度（0~255）
        const amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
        waveformDataRef.current = amplitudeArray;
        
        // 给“静态波形”准备一份同样大小的数组，用来保存其结果
        staticWaveformDataRef.current = new Uint8Array(amplitudeArray);

        // 先把静态波形画到大画布上（此时还没开始播放）
        renderStaticWaveform(canvasElt, amplitudeArray);
        
      })
      .catch((e) => {
        console.error(`Error: ${e}`);
        setStatusMessage(`Error loading audio: ${e.message}`);
        setIsLoading(false);
      });

    // 根据整首歌的音频数据，计算“静态波形”并绘制到大画布
    function renderStaticWaveform(canvasElt: HTMLCanvasElement, amplitudeArray: Uint8Array) {

     if (!audioBufferRef.current || !analyserNodeRef.current) return;
  
       const buffer = audioBufferRef.current;
       // 取左声道数据（可以把它理解为很多很多个“音量值”）
       const channelData = buffer.getChannelData(0);
       // 为了把整首歌压缩到固定宽度的画布上，这里做“抽样”（跳着取点）
       const step = Math.floor(channelData.length / amplitudeArray.length);

       // 这里用“最大值 + 平均值”的混合方法，让波形看起来更顺滑也更能体现峰值
       const windowSize = 8; // 可以理解成“取样窗口”的大小
      
        for (let i = 0; i < amplitudeArray.length; i++) {
          let sum = 0;
          let max = 0;
          let count = 0;
          
          for (let j = 0; j < windowSize; j++) {
            const index = i * step + Math.floor(j * step / windowSize);
            if (index < channelData.length) {
              const absValue = Math.abs(channelData[index]);
              sum += absValue;
              if (absValue > max) {
                max = absValue;
              }
              count++;
            }
          }
          const avgValue = sum / count;
          // 混合权重：70% 最大值 + 30% 平均值
          const mixedValue = max * 0.7 + avgValue * 0.3;
          
          // 把 [-1,1] 的声音数值映射到 [0,255]，方便在画布上画
          amplitudeArray[i] = Math.floor((mixedValue + 1) * 128);
        }

         // 保存静态波形结果，后面播放时会一边画它一边显示播放进度
        if (staticWaveformDataRef.current) {
          staticWaveformDataRef.current.set(amplitudeArray);
        }
        // 真正动手绘图（大画布），此时进度为 0
        const canvasContext = canvasElt.getContext("2d");
        if (canvasContext) {
          drawWaveform(canvasContext, canvasElt, amplitudeArray, 0);
        }
    }

    // 把“一个数组的高度数据”画到画布上，同时根据 progress 高亮“已播放的部分”
    function drawWaveform(
      canvasContext: CanvasRenderingContext2D,
      canvasElt: HTMLCanvasElement,
      amplitudeArray: Uint8Array,
      progress: number // 0 到 1 之间的进度值
    ) {

      // 清除画布
      canvasContext.clearRect(0, 0, canvasElt.width, canvasElt.height);

      const centerY = canvasElt.height / 2;
      const barWidth = canvasElt.width / amplitudeArray.length;
      
      // 计算进度线位置
      const progressX = canvasElt.width * progress;
      
      // 上半部分的颜色渐变（让图更好看）
      const upperGradient = canvasContext.createLinearGradient(0, 0, 0, centerY);
      upperGradient.addColorStop(0, 'rgba(7, 111, 247, 0.7)'); // 深紫色，更不透明
      upperGradient.addColorStop(1, 'rgba(7, 111, 247, 0.5)'); // 透明紫色
      
      // 已播放区域使用更亮的颜色，形成对比
      const upperGradientPlayed = canvasContext.createLinearGradient(0, 0, 0, centerY);
      upperGradientPlayed.addColorStop(0, 'rgba(7, 111, 247, 1)'); // 粉红色，更不透明
      upperGradientPlayed.addColorStop(1, 'rgba(7, 111, 247, 0.8)'); // 透明粉红色

      // 画“折叠后的波形”（把上下合并成上半部分展示，视觉更简洁）
      canvasContext.beginPath();
      canvasContext.moveTo(0, canvasElt.height); // 从底部开始
      
      for (let i = 0; i < amplitudeArray.length; i++) {
        const value = Math.abs((amplitudeArray[i] - 128) / 128); // 取绝对值，将上下部分合并
        const y = canvasElt.height - (value * centerY); // 从底部向上绘制
        const x = i * barWidth;
        canvasContext.lineTo(x, y);
      }
      
      canvasContext.lineTo(canvasElt.width, canvasElt.height);
      canvasContext.closePath();
      canvasContext.fillStyle = upperGradient;
      canvasContext.fill();
      
      // 根据 progress 高亮已播放区域，并画一条红色竖线作为“播放指针”
      if (progress > 0 && progress < 1) {
        // 已播放部分（同样是折叠后的形状）
        canvasContext.beginPath();
        canvasContext.moveTo(0, canvasElt.height);
        
        for (let i = 0; i < amplitudeArray.length; i++) {
          const x = i * barWidth;
          if (x > progressX) break;
          
          const value = Math.abs((amplitudeArray[i] - 128) / 128); // 取绝对值
          const y = canvasElt.height - (value * centerY);
          canvasContext.lineTo(x, y);
        }
        
        canvasContext.lineTo(progressX, canvasElt.height);
        canvasContext.closePath();
        canvasContext.fillStyle = upperGradientPlayed;
        canvasContext.fill();
        
        // 画“红色播放指针”
        canvasContext.beginPath();
        canvasContext.moveTo(progressX, canvasElt.height - centerY);
        canvasContext.lineTo(progressX, canvasElt.height);
        canvasContext.strokeStyle = 'rgba(255, 0, 0, 1)';
        canvasContext.lineWidth = 1;
        canvasContext.stroke();
      }
      
      // 给波形再描一层轮廓线，增强层次感
      canvasContext.beginPath();
      for (let i = 0; i < amplitudeArray.length; i++) {
        const value = Math.abs((amplitudeArray[i] - 128) / 128); // 取绝对值
        const y = canvasElt.height - (value * centerY);
        const x = i * barWidth;
        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }
      }
      // canvasContext.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      canvasContext.strokeStyle = 'rgba(7, 111, 247, 0.5)';
      canvasContext.lineWidth = 1;
      canvasContext.stroke();
    }

    // 在右上角小窗口画“实时波形”（每帧根据当前声音变化而变化）
    function drawMiniWaveform(
      canvasContext: CanvasRenderingContext2D,
      canvasElt: HTMLCanvasElement,
      amplitudeArray: Uint8Array
      // audioData: Float32Array // 注意这里我们使用Float32Array而不是Uint8Array
    ) {
      // 清除画布
      canvasContext.clearRect(0, 0, canvasElt.width, canvasElt.height);

      const centerY = canvasElt.height / 2;
      const barWidth = canvasElt.width / amplitudeArray.length;
      
      // 小窗口也加一个渐变，让视觉更柔和
      const gradient = canvasContext.createLinearGradient(0, 0, 0, centerY);
      gradient.addColorStop(0, 'rgba(7, 111, 247, 0.9)');
      gradient.addColorStop(1, 'rgba(7, 111, 247, 0.7)');

      // 先画上半部分
      canvasContext.beginPath();
      canvasContext.moveTo(0, centerY);
      
      for (let i = 0; i < amplitudeArray.length; i++) {
        const value = (amplitudeArray[i] - 128) / 128; // 归一化到 [-1, 1]
        const y = centerY - (value * centerY * 0.8); // 稍微缩小一些以增强视觉效果
        const x = i * barWidth;
        
        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }
      }
      canvasContext.closePath();
      canvasContext.fillStyle = gradient;
      canvasContext.fill();
      
      // 再画下半部分，形成一个“对称的形状”
      canvasContext.beginPath();
      canvasContext.moveTo(0, centerY);
      
      for (let i = 0; i < amplitudeArray.length; i++) {
        const value = (amplitudeArray[i] - 128) / 128; // 归一化到 [-1, 1]
        const y = centerY + (value * centerY);
        const x = i * barWidth;
        canvasContext.lineTo(x, y);
      }
      
      canvasContext.lineTo(canvasElt.width, centerY);
      canvasContext.closePath();
      canvasContext.fillStyle = gradient;
      canvasContext.fill();
 
      
      // 最后画一条细细的红线作为中轴
      canvasContext.beginPath();
      canvasContext.moveTo(0, centerY);
      canvasContext.lineTo(canvasElt.width, centerY);
      canvasContext.strokeStyle = 'rgba(255, 0, 0, 1)';
      canvasContext.lineWidth = 0.5;
      canvasContext.stroke();
    }

    // 点击“Start”时触发：
    // - 真正创建音源、连线到扬声器
    // - 连接分析器，准备读取实时数据
    // - 启动一个动画循环，不断重画两块画布（大画布显示进度，小画布显示实时波形）
    function playAudio() {
      if (!audioContextRef.current || !audioBufferRef.current) return;
      
      // 停止任何现有的播放
      stopAudio();
      
      const audioContext = audioContextRef.current;
      
      // 如果音频上下文已被暂停，恢复它
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // 创建新的源节点
      const sourceNode = new AudioBufferSourceNode(audioContext, {
        buffer: audioBufferRef.current,
        // playbackRate: 0.2
      });
      sourceNodeRef.current = sourceNode;
      
      // 设置分析器节点
      const analyserNode = new AnalyserNode(audioContext, {
        fftSize: 2048,
        smoothingTimeConstant: 0.8,
      });
      analyserNodeRef.current = analyserNode;
      
      // 创建JavaScript节点
      const javascriptNode = audioContext.createScriptProcessor(1024, 1, 1);
      javascriptNodeRef.current = javascriptNode;
      
      // 连接“音源 → 扬声器”，同时“音源 → 分析器 → 脚本节点 → 扬声器”
      // 这样既能听到声音，也能在每一帧拿到实时数据用于绘图
      sourceNode.connect(audioContext.destination);
      sourceNode.connect(analyserNode);
      analyserNode.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);
      
      // 记录开始时间
      startTimeRef.current = audioContext.currentTime - pausedTimeRef.current;
      isPlayingRef.current = true;
      
      // 播放音频，从暂停的位置开始
      sourceNode.start(0, pausedTimeRef.current);
      
      // 更新状态消息
      setStatusMessage("Audio playing...");
      
      // 动画循环：每一帧都更新一次画布
      function updateProgress() {
        if (!isPlayingRef.current || !audioContextRef.current || !audioBufferRef.current) return;
        
        const currentTime = audioContextRef.current.currentTime - startTimeRef.current;
        const duration = audioBufferRef.current.duration;
        const progress = Math.min(currentTime / duration, 1);
        
        // 读取“此刻”的时域数据（可以理解为当前这一小瞬间的音量曲线）
        const analyserNode = analyserNodeRef.current;
        if (analyserNode && waveformDataRef.current) {
          // 获取当前帧的时域数据
          const currentTimeDomainData = new Uint8Array(analyserNode.frequencyBinCount);
          analyserNode.getByteTimeDomainData(currentTimeDomainData);

          // 大画布：使用“静态波形 + 播放进度”
          if (staticWaveformDataRef.current) {
            const canvasContext = canvasElt.getContext("2d");
            drawWaveform(canvasContext, canvasElt, staticWaveformDataRef.current, progress);
          }

          // 小画布：使用“实时数据”，让波形随着声音跳动
          const miniCanvasContext = miniCanvasElt.getContext("2d");
          drawMiniWaveform(miniCanvasContext, miniCanvasElt, currentTimeDomainData);
        }
        
        // 继续动画循环
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(updateProgress);
        } else {
          // 播放结束
          stopAudio();
          setStatusMessage("Audio finished.");
        }
      }
      
      // 开始更新进度
      animationFrameRef.current = requestAnimationFrame(updateProgress);
      
      // 监听播放结束事件
      sourceNode.onended = () => {
        stopAudio();
        setStatusMessage("Audio finished.");
      };
    }

    // 点击“Stop”或播放结束时：
    // - 停掉音源与动画循环
    // - 保存当前播放到哪儿了（暂停位置）
    // - 恢复按钮状态
    function stopAudio() {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      
      if (javascriptNodeRef.current) {
        javascriptNodeRef.current.disconnect();
        javascriptNodeRef.current = null;
      }

      // 取消动画帧
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
      }
      
      // 保存暂停位置
      if (isPlayingRef.current && audioContextRef.current) {
        pausedTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
      }
      
      isPlayingRef.current = false;
      
      // 重置开始按钮状态
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }

    // 设置开始按钮事件
    startBtn.addEventListener("click", (e: any) => {
      e.preventDefault();
      startBtn.disabled = true;
      stopBtn.disabled = false;
      playAudio();
    });

    // 设置停止按钮事件
    stopBtn.addEventListener("click", (e: any) => {
      e.preventDefault();
      stopAudio();
      setStatusMessage("Audio stopped.");
    });

    // 页面卸载或组件销毁时，把一切都收拾干净，避免资源泄漏
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };

  }, [])

  return (
    <div>
      <h1>Web Audio API examples: audio analyser</h1>
      <canvas id="canvas" width="512" height="256" className={styles.canvas}></canvas>

      {/* 添加小窗口画布元素（新增） */}
      <canvas 
        id="mini_canvas" 
        width="200" 
        height="80" 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          backgroundColor: 'rgba(255, 255, 255, 1)',
          border: '1px solid rgba(0, 0, 0, 0.7)',
          borderRadius: '4px'
        }}
      ></canvas>
      <div id="controls">
        <input type="button" id="start_button" value={isLoading ? "Loading..." : "Start"} disabled={isLoading} />
        &nbsp; &nbsp;
        <input type="button" id="stop_button" value="Stop" disabled />
        <br /><br />
        <output id="msg">{statusMessage}</output>
      </div>
    </div>
  );
}
