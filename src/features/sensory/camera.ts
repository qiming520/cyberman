/**
 * 摄像头接入（Sprint #16 · M16-001）
 *
 * 详见 tech-design.md §3.4（sensory 模块）
 *
 * 功能：
 * - getUserMedia 调起摄像头（video 元素预览）
 * - takePhoto() 拍照（canvas 截帧 + base64 编码）
 * - stopCamera() 关闭
 *
 * 简化：暂不上传到 LLM Vision API（M16-002 后续 Sprint）
 * 当前只做拍照 + 显示 + 发送文字
 */
import { useState, useRef, useCallback, useEffect } from 'react';

export interface CameraResult {
  stream: MediaStream | null;
  isSupported: boolean;
  isOpen: boolean;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  takePhoto: () => string | null;  // 返回 base64 dataURL
}

/** Hook：管理摄像头状态（用于 ChatPage 等场景） */
export function useCamera(): CameraResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

  const startCamera = useCallback(async () => {
    if (!isSupported) {
      setError('当前浏览器不支持摄像头');
      return;
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      setIsOpen(true);
      setError(null);
      // 绑定到 video 元素（外部传入）
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      const messages: Record<string, string> = {
        'NotAllowedError': '摄像头权限被拒绝',
        'NotFoundError': '未找到摄像头设备',
        'NotReadableError': '摄像头被其他程序占用',
      };
      setError(messages[err?.name] || `摄像头错误: ${err?.message || '未知'}`);
    }
  }, [isSupported]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsOpen(false);
  }, [stream]);

  const takePhoto = useCallback((): string | null => {
    if (!videoRef.current || !stream) {
      setError('请先打开摄像头');
      return null;
    }
    const video = videoRef.current;
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [stream]);

  // 组件卸载自动关闭
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    stream,
    isSupported,
    isOpen,
    error,
    startCamera,
    stopCamera,
    takePhoto,
  };
}
