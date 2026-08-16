window.DIVE_LAB_C = {
  case: {
    title: '青波港ゲート3、通信障害後に航行制限を解除',
    summary: '港湾当局は10:18に「通信障害は解消した」と発表しました。一方、障害原因は確定しておらず、07:51以降の公式文面は複数回更新されています。',
    body: [
      '架空の青波港では07:42ごろ、ゲート3周辺の船舶通信データに途切れが確認されました。港湾当局は07:51に「技術点検のため一時制限」と告知し、09:02には「通信障害」と表現を変更しました。',
      '保守会社シーバード・システムズは、定期作業は07:30までに終了していたと述べています。08:31には地元放送が「侵入の可能性を調べている」と匿名関係者の話を報じましたが、その主張は独立確認されていません。',
      '10:18の当局更新は第三者保守の関与を追記しましたが、障害の直接原因とは断定していません。現時点で原因はUNKNOWNです。'
    ],
    source: 'KAWASEMI LAB synthetic case',
    published: '2026-08-16 10:24 JST',
    warning: 'このLABの事件・組織・人物・資料はすべて架空です。実在の出来事を示しません。'
  },
  sources: [
    {id:'authority-0751',kind:'OFFICIAL NOTICE',name:'青波港湾当局 公開告知 v1',time:'07:51',origin:'first_party',independence:'authority-notice',excerpt:'技術点検のため、ゲート3の航行を一時制限しています。原因は確認中です。',note:'当局がこの文面を公開したことは確認できる。文面内の原因説明そのものの真偽とは別。'},
    {id:'authority-0902',kind:'REVISION',name:'青波港湾当局 公開告知 v2',time:'09:02',origin:'first_party',independence:'authority-notice',excerpt:'通信障害のため、ゲート3の航行を一時制限しています。外部侵入を示す確認済みの証拠は現時点でありません。',note:'v1を更新した架空の保存版。変更履歴を保持。'},
    {id:'authority-1018',kind:'REVISION',name:'青波港湾当局 公開告知 v3',time:'10:18',origin:'first_party',independence:'authority-notice',excerpt:'通信障害は解消しました。第三者保守作業との関連を含め、原因を調査中です。',note:'「第三者保守作業」が初めて追記された。原因確定ではない。'},
    {id:'sensor-0742',kind:'MEASUREMENT',name:'ゲート3 公開通信センサー',time:'07:42',origin:'dataset',independence:'gate3-sensor',excerpt:'通信応答率 98% → 11%。AIS中継パケット欠損を検出。',note:'測定値が記録されたことのエビデンス。原因を説明するものではない。'},
    {id:'contractor-0805',kind:'MAINTENANCE LOG',name:'シーバード・システムズ 保守記録',time:'08:05',origin:'first_party',independence:'seabird-log',excerpt:'定期作業 06:45–07:30。07:58に「通信不安定」の追加チケットを起票。',note:'会社の作業記録。作業と障害の因果関係は未確定。'},
    {id:'broadcaster-0831',kind:'REPORT',name:'青波放送 速報',time:'08:31',origin:'independent_report',independence:'aonami-broadcast',excerpt:'匿名の港湾関係者は「侵入の可能性も調べている」と話した。',note:'匿名情報源に基づくCLAIM。独立確認なし。'},
    {id:'wire-a',kind:'REPORT',name:'東浜ニュース',time:'09:08',origin:'publisher',independence:'authority-notice',excerpt:'港湾当局は外部攻撃を否定した。',note:'当局v2を要約した二次記事。原文の「確認済みの証拠はない」を「否定」と強く言い換えている。'},
    {id:'wire-b',kind:'REPORT',name:'朝潮オンライン',time:'09:10',origin:'publisher',independence:'authority-notice',excerpt:'当局、サイバー攻撃を否定。',note:'東浜ニュースと同じ公式告知を根拠にしている。独立した確認線ではない。'},
    {id:'image-0914',kind:'IMAGE RECORD',name:'港湾カメラ 保存画像',time:'09:14',origin:'archive',independence:'camera-0914',excerpt:'09:14:22、ゲート3水域で2隻の作業船を確認。',note:'画像が示すのは船の存在と時刻。作業目的や原因は画像だけでは不明。'},
    {id:'archive-2025',kind:'HISTORICAL RECORD',name:'2025年 青波港通信障害報告',time:'2025-11-03',origin:'archive',independence:'historic-2025',excerpt:'別系統の通信障害時にもシーバード・システムズが保守契約を担当。原因は電源装置故障。',note:'歴史的に似た文脈。現在の障害を支持するEVIDENCEではない。'}
  ],
  models: [
    {id:'time-machine',no:'01',slug:'01-time-machine',name:'TIME MACHINE',jp:'時間を遡る',one:'今の記事から過去の公開状態へ戻り、「その時点で何が分かっていたか」を見る。',tags:['TIME','ARCHIVE','SNAPSHOT']},
    {id:'what-changed',no:'02',slug:'02-what-changed',name:'WHAT CHANGED',jp:'差分を読む',one:'同じ情報の2時点を重ね、追加・削除・言い換えだけを読む。',tags:['DIFF','VERSION','BEFORE/AFTER']},
    {id:'claim-comparison',no:'03',slug:'03-claim-comparison',name:'CLAIM COMPARISON',jp:'主張を並べる',one:'一つの問いに対して、誰がいつ何を言ったかを分離したまま比較する。',tags:['CLAIM','ACTOR','ATTRIBUTION']},
    {id:'evidence-chain',no:'04',slug:'04-evidence-chain',name:'EVIDENCE CHAIN',jp:'根拠を逆引きする',one:'記事の文から一次資料まで、情報がどこを通ってきたかを一段ずつ剥がす。',tags:['PROVENANCE','EVIDENCE','INDEPENDENCE']},
    {id:'event-reconstruction',no:'05',slug:'05-event-reconstruction',name:'EVENT RECONSTRUCTION',jp:'出来事を組み立てる',one:'断片的なSignalを「起きた時刻」と「観測された時刻」を分けて再構成する。',tags:['EVENT','SIGNAL','TIMELINE']},
    {id:'follow-entity',no:'06',slug:'06-follow-entity',name:'FOLLOW ENTITY',jp:'人物・組織・場所を追う',one:'一つの人物・組織・場所を軸に、別事件・過去・資料へ潜っていく。',tags:['ENTITY','HISTORY','CONTEXT']},
    {id:'contradiction',no:'07',slug:'07-contradiction',name:'CONTRADICTION',jp:'食い違いを見る',one:'対立する文を近づけ、何が本当に矛盾し、何が単なる言い換えかを確かめる。',tags:['CONTRADICTION','WORDING','SOURCE']},
    {id:'unanswered',no:'08',slug:'08-unanswered',name:'UNANSWERED',jp:'未回答だけを見る',one:'分かっていることではなく、まだ答えが出ていない問いと必要な証拠だけを見る。',tags:['UNKNOWN','QUESTION','RESUME']},
    {id:'who-knew-when',no:'09',slug:'09-who-knew-when',name:'WHO KNEW WHAT WHEN',jp:'公開記録の認識時系列',one:'時刻を動かし、各主体について「公開記録上いつ何が確認できるか」を並べる。',tags:['TIME','ACTOR','PUBLIC RECORD']},
    {id:'hypothesis-test',no:'10',slug:'10-hypothesis-test',name:'HYPOTHESIS TEST',jp:'仮説を壊してみる',one:'複数仮説を事実と分けたまま、証拠が何を支持・反証できるかを試す。',tags:['HYPOTHESIS','TEST','UNKNOWN']}
  ]
};
