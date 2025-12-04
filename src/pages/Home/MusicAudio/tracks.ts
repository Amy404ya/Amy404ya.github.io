// 这个文件由播放器使用，列出 `public/musics` 目录下的音乐与歌词资源
// 资源会被发布到站点根路径下的 `/musics/`，因此前端可以使用相对路径直接 fetch。
// 如果你添加/删除 `public/musics` 下的文件，请同步更新此文件或改为自动生成脚本。

export type Track = {
  id: string
  title: string
  artist: string
  cover: string
  audio: string // audio 文件相对于站点根的 URL，例如 `/musics/xxx.mp3`
  lrc: string // lrc 文件相对于站点根的 URL，例如 `/musics/xxx.lrc`
}

// 手动列出当前 public/musics 下的可用资源
const tracks: Track[] = [
  {
    id: 'FruitsOfMidsummer',
    title: '盛夏的果实 - 莫文蔚',
    artist: '莫文蔚',
    cover:'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    audio: '/musics/莫文蔚 - 盛夏的果实.mp3',
    lrc: '/musics/盛夏的果实-莫文蔚-歌词.lrc'
  },
  {
    id: 'ThereAreSoManyPeopleInThisWorld',
    title: '这世界那么多人 - 莫文蔚',
    artist: '莫文蔚',
    cover:'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80',
    audio: '/musics/莫文蔚 - 这世界那么多人.mp3',
    lrc: '/musics/这世界那么多人-莫文蔚-歌词.lrc'
  }
]

export default tracks
