export function clampBpm(value: number) {
  return Math.min(180, Math.max(50, value));
}
