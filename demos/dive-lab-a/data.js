(function(){
const DATA={
 anchor:{title:'令和6年能登半島地震で、地形はどこまで変わったのか',source:'気象庁 / 国土地理院 / 内閣府',date:'2024-01-01 →',summary:'2024年1月1日16時10分、石川県能登地方でM7.6、最大震度7の地震が発生。国土地理院は「だいち2号」などの解析と現地調査から、大きな地殻変動や海岸線の変化を報告した。ここでは「何が確認されたか」と「何が単なる関連・文脈か」を分けて探索する。'},
 items:{
  jma:{id:'jma',title:'M7.6・最大震度7',state:'CONFIRMED',kind:'evidence',relation:'confirms',source:'気象庁',body:'気象庁は2024年1月1日16時10分の地震をM7.6、最大震度7として掲載している。',why:'現在の地震そのものを確認する一次情報。'},
  uplift:{id:'uplift',title:'輪島市西部で最大約4mの隆起',state:'CONFIRMED',kind:'evidence',relation:'confirms',source:'国土地理院',body:'「だいち2号」の解析で輪島市西部に最大約4mの隆起が見られ、鹿磯漁港の現地調査でも約4mの隆起が確認された。',why:'衛星解析と現地調査が同じ方向の観測を示す。'},
  sar:{id:'sar',title:'SARで地殻変動を読む',state:'CONTEXT',kind:'technology',relation:'explains',source:'国土地理院',body:'合成開口レーダー（SAR）は地表の変化を広域に捉えられる。国土地理院は「だいち2号」観測データを用いて地殻変動と海岸線の変化を解析した。',why:'観測結果そのものではなく、結果を得る方法を理解するための技術文脈。'},
  coast:{id:'coast',title:'海岸線の変化と陸化域',state:'CONFIRMED',kind:'evidence',relation:'confirms',source:'国土地理院',body:'地震前後のSAR強度画像の比較から、能登半島北東先端部などで海岸線の変化と陸化域が確認された。',why:'地形変化を視覚的に追う直接観測。'},
  old2007:{id:'old2007',title:'2007年 能登半島地震',state:'CONTEXT',kind:'history',relation:'historically_similar_to',source:'気象庁',body:'2007年3月25日、能登半島沖でM6.9の地震が発生した。2024年の地震を理解する歴史的文脈にはなるが、2024年の個別事実を証明する材料ではない。',why:'同じ地域の過去事例という関係。similarity ≠ evidence。',weak:true},
  reports:{id:'reports',title:'被害情報は時間とともに更新された',state:'CONTEXT',kind:'impact',relation:'context_for',source:'内閣府',body:'内閣府は発災直後から被害状況等の資料を継続更新している。早期版と後期版では情報量と確度が変わるため、発表時点を保った比較が重要。',why:'被害の全体像は固定された一枚ではなく、更新履歴を持つ。'},
  port:{id:'port',title:'隆起は港・海岸利用の前提を変えうる',state:'CONTEXT',kind:'impact',relation:'affects',source:'観測からの文脈整理',body:'海岸線や標高の大きな変化は港湾・漁業・沿岸インフラの利用条件に影響しうる。ただし、この一般的な関係だけで個別施設の被害を断定してはいけない。',why:'観測された地形変化から考えられる影響方向。個別被害の証拠ではない。',weak:true},
  unknown:{id:'unknown',title:'どの変化が各地点の被害にどれだけ寄与したか',state:'UNKNOWN',kind:'unknown',relation:'unknown',source:'未解決の問い',body:'地震動、地殻変動、津波、地盤条件など複数要因があり、個別地点の被害原因は場所ごとの資料を確認しないと断定できない。',why:'分からないことを分からないまま残すための探索点。'},
  provenance:{id:'provenance',title:'「誰が何を測ったか」を分ける',state:'CONTEXT',kind:'source',relation:'source_of',source:'KAWASEMI demo structure',body:'気象庁は地震・震度、国土地理院は地殻変動や地形、内閣府は被害状況を主に扱う。ソースごとの観測対象の違いが、見えている世界の違いになる。',why:'複数ソースを一文に潰さず、役割の違いそのものを探索対象にする。'}
 },
 sources:[
  {name:'気象庁',title:'令和6年能登半島地震等の関連情報',note:'2024-01-01 16:10 / M7.6 / 最大震度7'},
  {name:'国土地理院',title:'令和6年(2024年)能登半島地震に関する情報',note:'だいち2号解析・現地調査・海岸線変化'},
  {name:'内閣府',title:'令和6年能登半島地震による被害状況等について',note:'被害状況の継続更新'}]
};
const MODES={
 'xray':{no:'01',name:'X-RAY ARTICLE',entry:'記事を透かして見る',entryHint:'本文の上に意味レイヤーを重ねる',desc:'同じ記事を EVIDENCE / CONTEXT / UNKNOWN / SOURCE のレイヤーで透かし、気になる断片からさらに潜る。'},
 'compass':{no:'02',name:'CURIOSITY COMPASS',entry:'方向を選んで潜る',entryHint:'「次の記事」ではなく方角を選ぶ',desc:'記事を中心に、EVIDENCE・TECHNOLOGY・HISTORY・IMPACT の方角から進路を選ぶ。'},
 'station':{no:'03',name:'DIVE STATION',entry:'この話から1本流す',entryHint:'安全な起点＋意外な次の1件',desc:'1つのアンカーから、関係タイプが明示された短い“Station”を流し、各地点で続けるか枝分かれする。'},
 'thread':{no:'04',name:'THREAD PULL',entry:'本文の「海岸線の変化」を引く',entryHint:'文章の一語を糸口にする',desc:'本文中の具体語を掴み、その語がどの観測・技術・歴史・影響へ伸びているかを一本の糸としてほどく。'},
 'time':{no:'05',name:'TIME SCRUB',entry:'時間軸で潜る',entryHint:'「いつ分かったか」を動かす',desc:'同じ出来事を発災時・衛星解析・現地確認・後期報告の時点で見比べ、知識が増える過程そのものを探索する。'},
 'nearby':{no:'06',name:'KNOWLEDGE NEARBY',entry:'周辺をひらく',entryHint:'地図の「近く」を知識に移植',desc:'現在地から1歩・2歩・3歩の距離で関係を広げ、近い根拠と遠い文脈を混同せずに周辺探索する。'},
 'shelves':{no:'07',name:'DISCOVERY SHELVES',entry:'別の棚から見る',entryHint:'同じ話を異なるコレクションで再発見',desc:'観測・地形・技術・歴史・影響の“棚”を横断し、棚をまたぐ意外なつながりを見つける。'},
 'compare':{no:'08',name:'SOURCE SPLIT',entry:'2つの見え方を並べる',entryHint:'違いを比較して発見する',desc:'2つのソースや観点を並べ、「同じ事件を見ているが答えられる質問が違う」こと自体を発見にする。'},
 'surprise':{no:'09',name:'SAFE SURPRISE',entry:'意外な1件を開く',entryHint:'驚きの範囲を先に自分で決める',desc:'ユーザーが TECH / CONTEXT / IMPACT の境界を選んでから、1件だけ予想外の関連を開く。弱い関連は弱いと表示する。'},
 'fieldnotes':{no:'10',name:'FIELD NOTES',entry:'調査を始める',entryHint:'発見を“集める”ことで次の問いが生まれる',desc:'気になる問いを置き、根拠や文脈を自分のノートへ追加。集めたものから次の探索方向を立ち上げる。'}
};

window.KLabData={DATA,MODES};
})();
