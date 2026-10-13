Booster.register({
  async search(q){
    const r = await fetch('https://itunes.apple.com/search?media=music&limit=25&term='+encodeURIComponent(q));
    const j = await r.json();
    return (j.results||[]).filter(x=>x.previewUrl).map(x=>({
      id:String(x.trackId), title:x.trackName, artist:x.artistName,
      album:x.collectionName, image:(x.artworkUrl100||'').replace('100x100','500x500'),
      url:x.previewUrl
    }));
  },
  async lyrics(t){
    const r = await fetch('https://lrclib.net/api/get?artist_name='+encodeURIComponent(t.artist)+'&track_name='+encodeURIComponent(t.title));
    if(!r.ok) return null;
    const j = await r.json();
    return { synced:j.syncedLyrics||'', plain:j.plainLyrics||'' };
  },
  async movies(q){
    const r = await fetch('https://archive.org/advancedsearch.php?q='+encodeURIComponent(q+' AND mediatype:movies')+'&fl[]=identifier&fl[]=title&rows=20&output=json');
    const j = await r.json();
    return j.response.docs.map(d=>({id:d.identifier,title:d.title,image:'https://archive.org/services/img/'+d.identifier}));
  },
  async movieStreams(m){
    const r = await fetch('https://archive.org/metadata/'+m.id);
    const j = await r.json();
    return (j.files||[]).filter(f=>/\.mp4$/i.test(f.name)).slice(0,3).map(f=>({
      title:f.name, url:'https://archive.org/download/'+m.id+'/'+encodeURIComponent(f.name), type:'mp4'
    }));
  }
});
