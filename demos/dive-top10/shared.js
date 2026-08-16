(() => {
  const demoId = document.body.dataset.demo || '01';
  const sources = {
    grid:{name:'北方送配電株式会社 · 系統接続工程表',title:'北岬沖連系設備 増強工事の工程更新',time:'2026-08-15 16:00',excerpt:'連系用変電設備の完成見込みを2028年9月へ更新。最終接続日は試験結果により変動する。',can:'公表された工事工程と更新日時',cannot:'風力事業全体の延期原因がこれだけだとは確認できない'},
    developer:{name:'北岬洋上風力合同会社 · 事業者発表',title:'商業運転開始時期の再調整について',time:'2026-08-15 18:20',excerpt:'系統接続設備の工程変更、港湾作業日程、調達条件を踏まえ、商業運転開始時期を再評価する。',can:'事業者が延期見直しを発表した事実',cannot:'挙げられた理由の相対的重要度や独立確認'},
    fishery:{name:'北岬漁業協同組合 · 会見要旨',title:'海底ケーブル工事と操業調整に関する説明',time:'2026-08-16 09:10',excerpt:'補償協議は継続中で、ケーブル敷設時期と一部漁場への影響範囲はまだ合意していない。',can:'組合がこの主張をしたこと',cannot:'実際の影響範囲や最終合意内容'},
    filing:{name:'北岬県 · 環境影響評価図書（公開版）',title:'北岬沖洋上風力発電事業 評価書・送電設備編',time:'2026-06-30',excerpt:'海底ケーブル候補ルート、陸揚げ地点、工事可能期間の前提を記載。',can:'公開文書に記載された計画条件',cannot:'その後の工程変更がすべて反映されているとは限らない'},
    port:{name:'北岬港湾局 · 工事予定表',title:'2027–2028年度 大型岸壁利用計画',time:'2026-08-12',excerpt:'大型部材搬入に使う岸壁の利用可能期間が複数工事と重なる。',can:'港湾局が公開した利用予定',cannot:'風力事業への最終的な遅延日数'},
    kawasemi:{name:'KAWASEMI · DEMO FIXTURE',title:'北海沖の洋上風力計画、系統増強の遅れで運転開始を再調整',time:'2026-08-16 10:30',excerpt:'複数の公開資料と当事者発表を、断定を増やさず構造化したデモ記事。',can:'このデモ内で使う整理の起点',cannot:'現実の出来事を表すものではない — 全データは架空'}
  };
  const configs = {
    '01':{slug:'question-field',title:'QUESTION FIELD',concept:'問いを選ぶと、同じニュースが違う方向に開く。',exciting:'「次の記事」ではなく「次の問い」を自分で選べる。',interaction:'Evidence / Unknown / History など、意味のある問いから潜る。',understanding:'何を知りたいかを保ったまま、深くも横にも進める。',risk:'方向が多すぎると選択疲れになる。',impl:'DIVE Node / Relation の上に薄い質問レイヤーを載せれば実装しやすい。'},
    '02':{slug:'evidence-desk',title:'EVIDENCE DESK',concept:'記事の主張を、根拠・主張・未確認に分けて机の上で見る。',exciting:'「この記事は何に立っている？」を一手でほどける。',interaction:'確認したい主張を選び、支持・主張のみ・未確認を比較する。',understanding:'断定の強さと根拠の位置が見える。',risk:'証拠が少ない記事では画面が薄くなる。',impl:'Claim / Evidence / Verification の共通データ契約と非常に相性が良い。'},
    '03':{slug:'change-lens',title:'CHANGE LENS',concept:'このニュースが前回から何を変えたかだけを追う。',exciting:'追い続けている話題で、読む量を増やさず変化だけ拾える。',interaction:'更新点を時間順に選び、Before / Now と新しいsourceを見る。',understanding:'何が新情報で、何が以前から同じか分かる。',risk:'初回閲覧では価値が弱い。',impl:'LIVEのnew-since cursorとArticle revisionをDIVE表示へ投影できる。'},
    '04':{slug:'source-descent',title:'SOURCE DESCENT',concept:'要約から一次資料へ、情報がどこから来たかを一段ずつ降りる。',exciting:'「その話の元は何？」を気持ちよく辿れる。',interaction:'KAWASEMI → 報道整理 → 当事者発表 → 公開文書へ降りる。',understanding:'各sourceが確認できること／できないことが分かる。',risk:'一次資料が取れないtopicでは途中で止まる。',impl:'既存source provenanceを階層表示するだけで成立しやすい。'},
    '05':{slug:'claims-matrix',title:'CLAIMS MATRIX',concept:'対立する人ではなく、対立する主張そのものを並べる。',exciting:'「誰が正しい？」の前に「何が食い違っている？」が見える。',interaction:'一致点 / 食い違い / 未確認を切り替え、各claimのsourceを開く。',understanding:'争点の輪郭と、独立して確認できる部分が分かる。',risk:'複雑な事件ではclaim数の整理が難しい。',impl:'Claimをactor別に保持するAI/Data契約から素直に投影できる。'},
    '06':{slug:'wormholes',title:'EXPLAINABLE WORMHOLES',concept:'意外だが説明できる接続を、数本だけ横に抜ける。',exciting:'「そこにつながるのか」という発見を狙える。',interaction:'3本の非自明な接続から1本を選び、理由とsourceを確認して次へ進む。',understanding:'記事単体では見えない技術・制度・地域のつながりが見える。',risk:'“意外さ”を優先すると関連性が弱くなる危険がある。',impl:'typed relation + provenanceを必須にし、候補数を少数に制限する。'},
    '07':{slug:'dependency-peel',title:'DEPENDENCY PEEL',concept:'出来事を「何に依存しているか」で一層ずつ剥がす。',exciting:'表面の理由から、止めている構造まで潜れる。',interaction:'延期 → 系統工事 → 接続設備 → 変電所容量へ、依存関係を展開する。',understanding:'原因・制約・技術依存を混同せず把握できる。',risk:'因果を強く言いすぎると誤解を作る。',impl:'caused_by / technical_dependency / part_of を文言付きで厳格に表示する。'},
    '08':{slug:'casebook',title:'DIVE CASEBOOK',concept:'探索すると、保存した発見と未解決の問いだけが静かに残る。',exciting:'調べたことが散らからず「自分の調査」になる。',interaction:'発見を保存し、問いをKeep Openし、離れてCONTINUEから戻る。',understanding:'どの道を辿り、何を残したかが後で使える。',risk:'記録UIが前に出ると探索の軽さを損なう。',impl:'DIVE SESSION v0.2の最小実装に最も近い。'},
    '09':{slug:'signal-traceback',title:'SIGNAL TRACEBACK',concept:'完成した記事から、LIVEで何がどう到着したかを逆向きに見る。',exciting:'ニュースが出来上がる前の“生の流れ”へ戻れる。',interaction:'Article → raw Signals → grouping reason → original sourceへ辿る。',understanding:'AIが何をまとめ、何を別に残したかを監査できる。',risk:'一般ユーザーには情報量が多い。',impl:'LIVE TRACEのSignal / EventClusterモデルをDIVEへ橋渡しできる。'},
    '10':{slug:'resume-updated',title:'RESUME + UPDATED',concept:'前回の探索はそのまま残し、新しい情報だけを上に重ねて再開する。',exciting:'追っている話題が「前回の続き」になる。',interaction:'2ステップ探索 → 離れる → CONTINUE → Updated since this diveを開く。',understanding:'過去に見た経路と、後から増えた情報を混ぜず比較できる。',risk:'更新検出が弱いと通知ノイズになる。',impl:'session snapshot + revision cursorで段階的に実装可能。'}
  };
  const cfg = configs[demoId];
  const state = {route:['記事'],saved:[],open:[],selected:'delay',mode:'all',phase:0,sourceDepth:0,dependency:1,caseHome:false,resumed:false,updated:false};

  const root = document.getElementById('app');
  root.innerHTML = `
    <div class="app">
      <header class="topbar">
        <button class="icon-btn" data-action="back" aria-label="戻る"><svg class="icon" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
        <span class="mark" aria-hidden="true"><svg viewBox="0 0 44 36"><polygon points="5,21 20,8 23,18 39,14 26,26 18,32"/><polygon points="20,8 30,5 23,18" opacity=".55"/></svg></span>
        <button class="icon-btn" data-action="info" aria-label="このデモについて"><svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 10v6M12 7.2v.2"/></svg></button>
      </header>
      <main class="shell">
        <section id="articleScreen" class="screen article-screen"></section>
        <section id="diveScreen" class="screen dive-screen hidden"></section>
      </main>
    </div>
    <div id="backdrop" class="backdrop" data-action="close-sheet"></div>
    <section id="sheet" class="sheet" role="dialog" aria-modal="true" aria-hidden="true"></section>
    <div id="toast" class="toast" role="status"></div>`;

  function articleMarkup(){
    return `<article class="article-card">
      <div class="hero"><div class="hero-copy">
        <div class="eyebrow"><span class="tag">DEMO FIXTURE · 架空データ</span><span>ENERGY / INFRASTRUCTURE</span></div>
        <h1>北岬沖の洋上風力計画、系統増強の遅れで運転開始を再調整</h1>
        <p class="summary">事業者は2028年春としていた商業運転開始時期を見直すと発表した。送配電会社は接続設備の工程を2028年後半まで更新。最終日程と追加費用、漁業調整の一部はまだ確定していない。</p>
      </div></div>
      <div id="entry" class="dive-entry"><button data-action="enter"><div><strong>DIVE</strong><span> · ${cfg.title}</span></div><i aria-hidden="true"></i></button></div>
      <div class="article-body">
        <p>北岬沖で計画されている洋上風力発電事業は、系統接続設備の工事工程が更新されたことなどを受け、商業運転の開始時期を再評価する。事業者は系統工事、港湾作業、調達条件を理由として挙げている。</p>
        <h2>確認できていること</h2>
        <p>送配電会社の公開工程表では、連系用変電設備の完成見込みが2028年9月へ変更された。事業者が運転開始時期の見直しを発表したことも確認できる。一方、どの要因がどれだけ延期に寄与するかは、公開資料だけでは確定できない。</p>
        <h2>まだ分からないこと</h2>
        <p>新しい商業運転開始日、追加費用の最終額、海底ケーブル工事と漁業補償の合意範囲は未確定。過去の類似案件は背景として参考になるが、この計画の原因を証明するものではない。</p>
        <div class="source-line"><button data-source="kawasemi"><small>SOURCE SET</small><strong>4 sources · provenance available</strong></button><span class="chev"></span></div>
      </div>
    </article>`;
  }
  const articleScreen = document.getElementById('articleScreen');
  const diveScreen = document.getElementById('diveScreen');
  articleScreen.innerHTML = articleMarkup();

  function routeMarkup(){ return `<nav class="route" aria-label="DIVE trail">${state.route.map((r,i)=>`<button data-route="${i}" class="${i===state.route.length-1?'current':''}">${escapeHtml(r)}</button>`).join('')}</nav>`; }
  function headerMarkup(sub=''){ return `<div class="dive-header"><div class="crumbs"><small>${cfg.title}</small><h1>${cfg.concept}</h1>${sub?`<p>${sub}</p>`:''}</div><div class="header-actions"><button class="icon-btn" data-action="article" aria-label="記事へ戻る"><svg class="icon" viewBox="0 0 24 24"><path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4"/></svg></button></div></div>${routeMarkup()}`; }
  function sessionBar(label='探索中'){ return `<div class="session-bar"><div><small>DIVE SESSION</small><strong>${label}</strong></div><div></div><div class="session-actions"><button data-action="save" aria-label="発見を保存"><svg class="icon" viewBox="0 0 24 24"><path d="M7 4h10v16l-5-3-5 3z"/></svg></button><button data-action="open-question" aria-label="問いを残す"><svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M9.7 9a2.5 2.5 0 0 1 4.7 1.2c0 1.8-2.4 2.1-2.4 3.8M12 17h.01"/></svg></button></div></div>`; }
  function pushRoute(label){ if(state.route[state.route.length-1]!==label) state.route.push(label); }
  function rerender(){ renderDive(); }
  function renderDive(){
    let body='';
    if(demoId==='01') body=renderQuestionField();
    if(demoId==='02') body=renderEvidenceDesk();
    if(demoId==='03') body=renderChangeLens();
    if(demoId==='04') body=renderSourceDescent();
    if(demoId==='05') body=renderClaimsMatrix();
    if(demoId==='06') body=renderWormholes();
    if(demoId==='07') body=renderDependencyPeel();
    if(demoId==='08') body=renderCasebook();
    if(demoId==='09') body=renderSignalTraceback();
    if(demoId==='10') body=renderResumeUpdated();
    diveScreen.innerHTML=headerMarkup(demoSubtitle())+body+sessionBar(sessionLabel());
  }
  function demoSubtitle(){
    const map={
      '01':'方向をAIに任せず、あなたが問いを選ぶ。','02':'Claim・Evidence・Unknownを混ぜずに検査する。','03':'前回から変わった部分だけを見る。','04':'要約から原資料へ、出所を一段ずつ降りる。','05':'人ではなく、主張の一致・不一致を見る。','06':'意外さより、説明可能な接続を優先する。','07':'表面の出来事から依存関係を一層ずつ剥がす。','08':'閲覧履歴ではなく、残したい発見と問いを記録する。','09':'完成した記事から、到着したSignalsへ逆向きに戻る。','10':'以前の探索を保存し、新情報は後から別レイヤーで重ねる。'};
    return map[demoId];
  }
  function sessionLabel(){
    if(demoId==='08') return `${state.saved.length} saved · ${state.open.length} open`;
    if(demoId==='10'&&state.resumed) return state.updated?'再開済み · 更新を確認':'前回の位置から再開';
    return state.route[state.route.length-1];
  }

  function renderQuestionField(){
    const current=state.route[state.route.length-1];
    if(current==='記事') return `<div class="stage"><div class="stage-pad"><span class="kicker">CHOOSE A QUESTION</span><h2 class="section-title">どこから潜る？</h2><p class="section-copy">ある方向だけを強く勧めない。情報がある方向だけを出す。</p><div class="question-list">
      ${q('EVIDENCE','何が根拠になっている？','q-evidence')}${q('CLAIMS','誰が何を主張している？','q-claims')}${q('UNKNOWN','まだ何が分からない？','q-unknown')}${q('HISTORY','過去の類似は何を教える？','q-history')}${q('TECHNOLOGY','どの技術がボトルネック？','q-tech')}${q('IMPACT','何に影響が広がる？','q-impact')}
    </div></div></div>`;
    if(current==='EVIDENCE') return `<div class="stage"><div class="stage-pad"><span class="kicker">EVIDENCE</span><h2 class="section-title">延期について直接確認できる材料</h2><div class="focus-card"><button data-action="q-grid"><small>DOCUMENT</small><strong>系統接続工程表が更新された</strong><p>完成見込み：2028年9月。事業者発表より前に公開。</p><span class="relation">supports a scheduling constraint</span></button></div><div class="focus-card"><button data-source="developer"><small>ATTRIBUTED CLAIM</small><strong>事業者は系統工事・港湾・調達を理由に挙げた</strong><p>理由を挙げた事実は確認できる。原因の比重は未確認。</p></button></div></div></div>`;
    if(current==='接続工程') return `<div class="stage"><div class="stage-pad"><span class="kicker">CURRENT FOCUS</span><h2 class="section-title">系統接続工程</h2><p class="section-copy">この工程は、さらに「技術」と「時間」の方向へ潜れる。</p><div class="question-list">${q('TECHNOLOGY','なぜこの設備が必要？','q-substation')}${q('TIME','いつ変更された？','q-time')}${q('HISTORY','過去の系統制約と似ている？','q-history')}</div><div class="mini-actions"><button class="quiet-btn" data-source="grid">SOURCEを見る</button></div></div></div>`;
    if(current==='HISTORY') return `<div class="stage"><div class="stage-pad"><span class="kicker">HISTORICAL CONTEXT</span><h2 class="section-title">過去の系統接続遅延</h2><p class="section-copy">似た制約は存在する。ただし、現在の延期理由を証明するものではない。</p><div class="notice"><strong>historically_similar_to</strong><br>類似は文脈。現在の出来事を支持するEvidenceとして扱わない。</div><div class="mini-actions"><button class="quiet-btn" data-source="grid">今回のsourceへ戻る</button><button class="quiet-btn" data-action="q-impact">影響を見る</button></div></div></div>`;
    return `<div class="stage"><div class="stage-pad"><span class="kicker">${escapeHtml(current)}</span><h2 class="section-title">この方向の次の問い</h2><div class="question-list">${q('SOURCE','元資料はどこ？','open-grid')}${q('UNKNOWN','まだ確定していない点は？','q-unknown')}${q('IMPACT','この条件が何に影響する？','q-impact')}</div></div></div>`;
  }
  function q(label,text,action){return `<button class="question" data-action="${action}"><b>${label}</b><span>${text}</span><i class="chev"></i></button>`}

  function renderEvidenceDesk(){
    const claim = state.selected==='delay'?'運転開始見直しの主因は系統接続工程の遅れ':'海底ケーブル工事が漁業調整を難しくしている';
    return `<div class="stage"><div class="two-pane"><section class="pane"><span class="kicker">CLAIM TO INSPECT</span><h2 class="section-title">何を検査する？</h2><div class="claim-selector"><button class="${state.selected==='delay'?'active':''}" data-action="claim-delay"><small>CLAIM A</small><strong>運転開始見直しの主因は系統接続工程の遅れ</strong></button><button class="${state.selected==='fish'?'active':''}" data-action="claim-fish"><small>CLAIM B</small><strong>海底ケーブル工事が漁業調整を難しくしている</strong></button></div><div class="notice unknown">選んだClaimそのものをAIが「真実」に格上げしない。</div></section><section class="pane"><span class="kicker">EVIDENCE DESK</span><h2 class="section-title">${claim}</h2><div class="evidence-grid">${state.selected==='delay'?`
      ${eCard('supports','DOCUMENT','工程表は完成見込みを2028年9月へ更新','grid')}${eCard('claim','ATTRIBUTED CLAIM','事業者は系統工事を延期理由の一つに挙げる','developer')}${eCard('unknown','NOT ESTABLISHED','「主因」である比重は独立に確認できていない','')}`:`
      ${eCard('supports','DOCUMENT','評価書には漁場付近のケーブル候補ルートがある','filing')}${eCard('claim','ATTRIBUTED CLAIM','漁協は補償と工期が未合意と説明','fishery')}${eCard('unknown','NOT ESTABLISHED','どの範囲が実際に操業制約となるか未確定','')}`}</div></section></div></div>`;
  }
  function eCard(stateName,label,title,source){return `<button class="evidence-card" data-state="${stateName}" ${source?`data-source="${source}"`:''}><small>${label}</small><strong>${title}</strong><p>${stateName==='supports'?'関連する根拠として確認可能。':stateName==='claim'?'発言した事実と、発言内容の真偽を分ける。':'現時点では断定しない。'}</p></button>`}

  function renderChangeLens(){
    const items=[['08/12','港湾予定表','大型岸壁の利用期間が重なる'],['08/15 16:00','系統工程更新','変電設備の完成見込みが2028年9月へ'],['08/15 18:20','事業者発表','商業運転開始時期を再評価'],['08/16 09:10','漁協会見','補償協議は継続中']];
    const idx=Math.min(state.phase,3); const now=items[idx];
    return `<div class="stage"><div class="stage-pad"><span class="kicker">WHAT CHANGED</span><h2 class="section-title">前回から増えた情報だけを辿る</h2><div class="timeline">${items.map((x,i)=>`<button class="update-card ${i===idx?'active':''}" data-change="${i}"><small>${x[0]}</small><strong>${x[1]}</strong><p>${x[2]}</p></button>`).join('')}</div><div class="diff-view"><div class="diff-col"><h3>BEFORE</h3><p>${idx<2?'運転開始は2028年春予定。':'系統工程の変更は確認済みだが、事業者の正式な開始時期見直しはまだ出ていない。'}</p></div><div class="diff-col"><h3>NOW · NEW</h3><p class="diff-added">${now[2]}</p><div class="mini-actions"><button class="quiet-btn" data-source="${['port','grid','developer','fishery'][idx]}">この更新のsource</button></div></div></div></div></div>`;
  }

  function renderSourceDescent(){
    const steps=[
      ['KAWASEMI','構造化記事','複数sourceを混ぜずに要点を整理','kawasemi'],
      ['ATTRIBUTED RELEASE','事業者発表','開始時期を再評価すると発表','developer'],
      ['ORIGINAL DOCUMENT','送配電会社 工程表','接続設備の完成見込みを更新','grid'],
      ['PLANNING DOCUMENT','環境影響評価図書','ケーブル候補ルートと工事条件','filing']
    ];
    return `<div class="stage"><div class="stage-pad"><span class="kicker">DESCEND TO ORIGIN</span><h2 class="section-title">この情報は、どこから来た？</h2><p class="section-copy">下へ行くほど“一次”とは限らない。各sourceが何を確認できるかを明示する。</p><div class="source-ladder">${steps.map((s,i)=>`<button class="source-step ${i===state.sourceDepth?'active':''}" data-depth="${i}"><small>${s[0]}</small><strong>${s[1]}</strong><p>${s[2]}</p>${i===state.sourceDepth?`<div class="source-capability">確認できる：${sources[s[3]].can}<br>確認できない：${sources[s[3]].cannot}</div>`:''}</button>`).join('')}</div><div class="mini-actions"><button class="primary-btn" data-source="${steps[state.sourceDepth][3]}">現在のsourceを見る</button>${state.sourceDepth<steps.length-1?'<button class="quiet-btn" data-action="descend">もう一段降りる</button>':''}</div></div></div>`;
  }

  function renderClaimsMatrix(){
    const mode=state.mode;
    const cards=[
      {actor:'事業者',claim:'系統工事、港湾、調達条件を踏まえ開始時期を再評価する。',source:'developer',agree:true,conflict:false},
      {actor:'送配電会社',claim:'連系設備の完成見込みを2028年9月へ更新した。最終接続日は試験で変動する。',source:'grid',agree:true,conflict:false},
      {actor:'漁業協同組合',claim:'補償協議は継続中。ケーブル工事時期と影響範囲はまだ合意していない。',source:'fishery',agree:false,conflict:true}
    ];
    return `<div class="stage"><div class="stage-pad"><span class="kicker">WHO SAYS WHAT</span><h2 class="section-title">延期をめぐる主張を、混ぜずに置く</h2><div class="claims-toolbar"><button class="quiet-btn ${mode==='all'?'active':''}" data-mode="all">ALL</button><button class="quiet-btn ${mode==='agree'?'active':''}" data-mode="agree">一致している点</button><button class="quiet-btn ${mode==='conflict'?'active':''}" data-mode="conflict">食い違い / 未合意</button></div><div class="claims-grid">${cards.map(c=>`<button class="claim-card ${(mode==='agree'&&!c.agree)||(mode==='conflict'&&!c.conflict)?'dim':''}" data-source="${c.source}"><small class="actor">${c.actor}</small><strong>${c.claim}</strong><div class="status">${c.actor==='送配電会社'?'DOCUMENTED SCHEDULE':'ATTRIBUTED CLAIM'}</div></button>`).join('')}</div><div class="agreement">${mode==='agree'?'一致：開始時期を決める前提条件がまだ動いている。これは「原因の比重が一致した」という意味ではない。':mode==='conflict'?'未合意：海底ケーブル工事の時期・影響範囲。事業者側の全体工程と漁協側の合意状況を別々に保持する。':'切り替えると、共通部分と食い違いだけを抽出できる。'}</div></div></div>`;
  }

  function renderWormholes(){
    const current=state.route[state.route.length-1];
    const second=current==='港湾ウィンドウ';
    const items=second?[
      ['affects','港湾ウィンドウ → 大型部材の保管','岸壁が空いていても、一時保管ヤードの制約で搬入順が変わる。','port','w-storage'],
      ['context_for','港湾ウィンドウ → 地域雇用','短期工事の集中が人員需要の波を作る。','port','w-jobs'],
      ['historically_similar_to','港湾ウィンドウ → 過去案件','似た工期競合はあるが、今回の延期証拠ではない。','port','w-history']
    ]:[
      ['technical_dependency','系統遅延 → 港湾ウィンドウ','接続時期がずれると大型部材の搬入枠と再調整が必要になる。','port','w-port'],
      ['affects','系統遅延 → 蓄電池計画','接続容量の時期が、併設蓄電池の運用設計にも影響する。','grid','w-battery'],
      ['context_for','ケーブル工事 → 漁業補償','技術工程が地域交渉の時間軸にもつながる。','fishery','w-fish']
    ];
    return `<div class="stage"><div class="stage-pad"><span class="kicker">EXPLAINABLE CONNECTIONS</span><h2 class="section-title">予想外でも、理由が説明できる道だけ</h2><p class="section-copy">ランダムな関連記事ではない。relation type と provenance が必須。</p><div class="wormhole-list">${items.map(x=>`<button class="wormhole" data-action="${x[4]}"><small>${x[0]}</small><strong>${x[1]}</strong><p>${x[2]}</p><div class="why-link" data-source="${x[3]}">WHY CONNECTED →</div></button>`).join('')}</div>${current==='港湾ウィンドウ'?'<div class="notice">2つ前の記事から、技術 → 港湾 → 雇用/保管へ横に移動した。一本道の推薦ではない。</div>':''}</div></div>`;
  }

  function renderDependencyPeel(){
    const layers=[
      ['1 · EVENT','運転開始時期を再調整','confirmed: 事業者が見直しを発表','developer'],
      ['2 · CONSTRAINT','系統接続設備の工程が後ろ倒し','supports a constraint: 公開工程表','grid'],
      ['3 · TECHNICAL DEPENDENCY','連系変電設備が商業運転に必要','technical_dependency: 接続条件','grid'],
      ['4 · UNDERLYING CAPACITY','既存系統の受入容量と増強工事','context_for: 事業の構造的条件','grid']
    ];
    return `<div class="stage"><div class="stage-pad"><span class="kicker">WHY IS THIS BLOCKED?</span><h2 class="section-title">出来事を「依存しているもの」で剥がす</h2><div class="layers">${layers.map((x,i)=>`<button class="dependency-layer ${i<state.dependency?'active':''}" data-layer="${i+1}" data-depth="${i+1}"><small>${x[0]}</small><strong>${x[1]}</strong>${i<state.dependency?`<p>${x[2]}</p><span class="relation">${i===0?'claims / observed action':i===1?'supports constraint':'technical_dependency'}</span>`:''}</button>`).join('')}</div><div class="mini-actions"><button class="primary-btn" data-action="peel">一層深く</button><button class="quiet-btn" data-source="${layers[Math.max(0,state.dependency-1)][3]}">現在層のsource</button></div><div class="notice">「下の層がある」ことと「唯一の原因」であることは別。因果の強さを勝手に足さない。</div></div></div>`;
  }

  function renderCasebook(){
    if(state.caseHome){
      return `<div class="stage"><div class="session-home"><span class="kicker">DIVE HOME</span><h2 class="section-title">CONTINUE</h2><button class="continue-card" data-action="resume-case"><small>PAUSED · 北岬沖 洋上風力</small><h3>${state.route[state.route.length-1]}</h3><p>前回の探索位置、保存した発見、Open Questionをそのまま復元する。</p><div class="metric-row"><span>${state.saved.length} saved</span><span>${state.open.length} open</span><span>${state.route.length-1} steps</span></div></button></div></div>`;
    }
    return `<div class="stage"><div class="case-layout"><section class="case-main"><span class="kicker">EXPLORE</span><h2 class="section-title">調べながら、必要なものだけ残す</h2><div class="question-list">${q('EVIDENCE','工程表を確認する','case-evidence')}${q('UNKNOWN','新しい運転開始日は？','case-unknown')}${q('PEOPLE','誰が合意を持っている？','case-people')}</div><div class="mini-actions"><button class="quiet-btn" data-action="leave-case">DIVEを離れる</button></div></section><aside class="case-book"><span class="kicker">CASEBOOK</span><div class="book-section"><h3>SAVED DISCOVERIES</h3>${state.saved.length?state.saved.map(x=>`<div class="book-item">${escapeHtml(x)}</div>`).join(''):'<div class="book-item">まだ保存していない</div>'}</div><div class="book-section"><h3>OPEN QUESTIONS</h3>${state.open.length?state.open.map(x=>`<div class="book-item">${escapeHtml(x)}</div>`).join(''):'<div class="book-item">まだ残していない</div>'}</div><div class="book-section"><h3>ROUTE</h3><div class="book-item">${state.route.join(' › ')}</div></div></aside></div></div>`;
  }

  function renderSignalTraceback(){
    return `<div class="stage"><div class="stage-pad"><span class="kicker">FROM STORY BACK TO SIGNALS</span><h2 class="section-title">この記事は、どんなSignalsから組み上がった？</h2><span class="same-event">LIKELY SAME EVENT · grouping hypothesis</span><div class="signal-stack">
      ${signal('08/15 16:00','北方送配電','工程表を更新。完成見込み2028年9月。','grid')}
      ${signal('08/15 18:20','事業者','商業運転開始時期を再評価すると発表。','developer')}
      ${signal('08/16 09:10','漁協','補償協議と工事時期は未合意と説明。','fishery')}
      ${signal('08/16 10:05','UNGROUPED','港湾局の岸壁利用計画。関連候補だが同一eventとは未確定。','port')}
    </div><div class="cluster-note"><strong>なぜ同じEvent候補にまとめた？</strong><p class="section-copy">同じ事業・接続工程・時間窓を共有するため。これは「同じ出来事らしさ」であり、各claimの真偽ではない。</p><button class="quiet-btn" data-action="grouping">grouping理由を見る</button></div></div></div>`;
  }
  function signal(time,actor,text,source){return `<button class="signal-card" data-source="${source}"><div class="time">${time}</div><div class="signal-body"><small>${actor}</small><strong>${text}</strong><p>raw/source-level itemを保持。</p></div></button>`}

  function renderResumeUpdated(){
    if(state.phase===0){
      return `<div class="stage"><div class="stage-pad"><span class="kicker">START A SESSION</span><h2 class="section-title">2ステップだけ潜って、いったん離れる</h2><div class="question-list">${q('EVIDENCE','工程表を確認する','resume-step1')}${q('UNKNOWN','新しい開始日は決まった？','resume-step2')}</div><div class="notice">まず1〜2手進むと、Sessionが保存される。</div></div></div>`;
    }
    if(state.phase===1){
      return `<div class="stage"><div class="stage-pad"><span class="kicker">CURRENT FOCUS</span><h2 class="section-title">系統接続工程</h2><p class="section-copy">工程表の更新を確認した。次にUNKNOWNを開いてから離れる。</p><div class="question-list">${q('UNKNOWN','新しい運転開始日は決まった？','resume-step2')}${q('SOURCE','元の工程表を見る','open-grid')}</div></div></div>`;
    }
    if(state.phase===2&&!state.resumed){
      return `<div class="stage"><div class="stage-pad"><span class="kicker">PAUSE HERE</span><h2 class="section-title">新しい運転開始日は未確定</h2><p class="section-copy">この状態のrouteとsource参照を保存して、DIVE Homeへ戻る。</p><div class="mini-actions"><button class="primary-btn" data-action="leave-resume">DIVEを離れる</button><button class="quiet-btn" data-action="open-question">Open Questionに残す</button></div></div></div>`;
    }
    if(state.phase===3&&!state.resumed){
      return `<div class="stage"><div class="session-home"><span class="kicker">DIVE HOME</span><h2 class="section-title">CONTINUE</h2><button class="continue-card" data-action="resume-session"><small>PAUSED · 18 min ago</small><h3>新しい運転開始日は未確定</h3><p>前回のrouteは書き換えず、そのまま再開する。</p><div class="metric-row"><span>2 steps</span><span>${state.open.length} open</span></div></button></div></div>`;
    }
    return `<div class="stage"><div class="stage-pad"><span class="kicker">RESUMED SESSION</span><h2 class="section-title">前回の位置を保ったまま、新情報だけ重ねる</h2><div class="resume-grid"><div class="resume-card"><small>PREVIOUS SESSION SNAPSHOT</small><h3>新しい運転開始日は未確定</h3><p>前回あなたが見た内容。後からAIが勝手に書き換えない。</p></div><button class="resume-card" data-action="show-update"><small>UPDATED SINCE THIS DIVE</small><h3>${state.updated?'漁協：補償協議は継続中':'1 new source available'}</h3><p>${state.updated?'新しいsourceを別レイヤーで追加。以前のrouteとは分離。':'タップして、増えた情報だけ確認。'}</p><span class="update-badge">${state.updated?'NEW SOURCE · 09:10':'VIEW UPDATE'}</span></button></div>${state.updated?'<div class="mini-actions"><button class="quiet-btn" data-source="fishery">新しいsourceを見る</button></div>':''}</div></div>`;
  }

  function showSource(key){
    const s=sources[key]||sources.kawasemi; const sheet=document.getElementById('sheet');
    sheet.innerHTML=`<div class="sheet-handle"></div><div class="sheet-head"><small>SOURCE / PROVENANCE</small><button class="close-sheet" data-action="close-sheet" aria-label="閉じる">×</button></div><h2>${escapeHtml(s.title)}</h2><p>${escapeHtml(s.excerpt)}</p><div class="sheet-meta"><div><small>SOURCE</small><strong>${escapeHtml(s.name)}</strong></div><div><small>PUBLISHED</small><strong>${escapeHtml(s.time)}</strong></div><div><small>CAN CONFIRM</small><strong>${escapeHtml(s.can)}</strong></div><div><small>CANNOT CONFIRM</small><strong>${escapeHtml(s.cannot)}</strong></div><div><small>DEMO NOTE</small><strong>このデモのsourceと出来事は架空。UI/interaction評価専用。</strong></div></div>`;
    openSheet();
  }
  function showInfo(){
    const sheet=document.getElementById('sheet');
    sheet.innerHTML=`<div class="sheet-handle"></div><div class="sheet-head"><small>TOP 10 · ${demoId}</small><button class="close-sheet" data-action="close-sheet" aria-label="閉じる">×</button></div><h2>${cfg.title}</h2><p>${cfg.concept}</p><dl class="info-list"><div><dt>WHY IT IS EXCITING</dt><dd>${cfg.exciting}</dd></div><div><dt>CORE INTERACTION</dt><dd>${cfg.interaction}</dd></div><div><dt>UNDERSTANDING</dt><dd>${cfg.understanding}</dd></div><div><dt>RISK / WEAKNESS</dt><dd>${cfg.risk}</dd></div><div><dt>IMPLEMENTATION</dt><dd>${cfg.impl}</dd></div></dl>`;
    openSheet();
  }
  function openSheet(){document.getElementById('backdrop').classList.add('open');document.getElementById('sheet').classList.add('open');document.getElementById('sheet').setAttribute('aria-hidden','false')}
  function closeSheet(){document.getElementById('backdrop').classList.remove('open');document.getElementById('sheet').classList.remove('open');document.getElementById('sheet').setAttribute('aria-hidden','true')}
  function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),1300)}
  function enter(){articleScreen.classList.add('hidden');diveScreen.classList.remove('hidden');document.getElementById('entry').classList.add('hidden');renderDive();window.scrollTo(0,0)}
  function article(){diveScreen.classList.add('hidden');articleScreen.classList.remove('hidden');document.getElementById('entry').classList.remove('hidden');window.scrollTo(0,0)}
  function back(){if(!diveScreen.classList.contains('hidden')){if(state.route.length>1){state.route.pop(); if(demoId==='10'&&state.route.length===1){state.phase=0;state.resumed=false;state.updated=false} rerender()}else article()}else history.length>1?history.back():null}
  function save(){const item=state.route[state.route.length-1]; if(!state.saved.includes(item))state.saved.push(item);toast('Saved Discovery');if(demoId==='08')rerender()}
  function openQuestion(){const qText=demoId==='08'?'新しい運転開始日はいつ確定する？':'新しい運転開始日はいつ確定する？';if(!state.open.includes(qText))state.open.push(qText);toast('Open Questionに追加');if(demoId==='08')rerender()}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  document.addEventListener('click',e=>{
    const sourceEl=e.target.closest('[data-source]'); if(sourceEl){e.stopPropagation();showSource(sourceEl.dataset.source);return}
    const change=e.target.closest('[data-change]'); if(change){state.phase=+change.dataset.change;pushRoute(['港湾予定','系統工程','事業者発表','漁協会見'][state.phase]);rerender();return}
    const depth=e.target.closest('[data-depth]'); if(depth&&demoId==='04'){state.sourceDepth=+depth.dataset.depth;pushRoute(['KAWASEMI','事業者発表','工程表','評価図書'][state.sourceDepth]);rerender();return}
    const mode=e.target.closest('[data-mode]'); if(mode){state.mode=mode.dataset.mode;rerender();return}
    const layer=e.target.closest('[data-layer]'); if(layer){state.dependency=Math.max(state.dependency,+layer.dataset.layer);pushRoute(['記事','工程変更','接続設備','系統容量'][state.dependency-1]||'依存関係');rerender();return}
    const route=e.target.closest('[data-route]'); if(route){const i=+route.dataset.route;state.route=state.route.slice(0,i+1);rerender();return}
    const el=e.target.closest('[data-action]'); if(!el)return; const a=el.dataset.action;
    if(a==='enter')return enter(); if(a==='article')return article(); if(a==='back')return back(); if(a==='info')return showInfo(); if(a==='close-sheet')return closeSheet(); if(a==='save')return save(); if(a==='open-question')return openQuestion();
    if(a==='q-evidence'){pushRoute('EVIDENCE');rerender()} else if(a==='q-claims'){pushRoute('CLAIMS');rerender()} else if(a==='q-unknown'){pushRoute('UNKNOWN');rerender()} else if(a==='q-history'){pushRoute('HISTORY');rerender()} else if(a==='q-tech'){pushRoute('TECHNOLOGY');rerender()} else if(a==='q-impact'){pushRoute('IMPACT');rerender()} else if(a==='q-grid'){pushRoute('接続工程');rerender()} else if(a==='q-substation'){pushRoute('変電設備');rerender()} else if(a==='q-time'){pushRoute('TIME');rerender()} else if(a==='open-grid'){showSource('grid')}
    else if(a==='claim-delay'){state.selected='delay';pushRoute('延期の主因');rerender()} else if(a==='claim-fish'){state.selected='fish';pushRoute('漁業調整');rerender()}
    else if(a==='descend'){state.sourceDepth=Math.min(3,state.sourceDepth+1);pushRoute(['KAWASEMI','事業者発表','工程表','評価図書'][state.sourceDepth]);rerender()}
    else if(a==='w-port'){pushRoute('港湾ウィンドウ');rerender()} else if(a==='w-storage'){pushRoute('保管ヤード');rerender()} else if(a==='w-jobs'){pushRoute('地域雇用');rerender()} else if(a==='w-history'){pushRoute('過去案件');rerender()} else if(a==='w-battery'){pushRoute('蓄電池');rerender()} else if(a==='w-fish'){pushRoute('漁業補償');rerender()}
    else if(a==='peel'){state.dependency=Math.min(4,state.dependency+1);pushRoute(['記事','工程変更','接続設備','系統容量'][state.dependency-1]);rerender()}
    else if(a==='case-evidence'){pushRoute('工程表');if(!state.saved.includes('系統工程：完成見込み2028年9月'))state.saved.push('系統工程：完成見込み2028年9月');toast('発見を保存');rerender()} else if(a==='case-unknown'){pushRoute('開始日未確定');if(!state.open.includes('新しい運転開始日はいつ確定する？'))state.open.push('新しい運転開始日はいつ確定する？');toast('Open Questionに追加');rerender()} else if(a==='case-people'){pushRoute('合意主体');rerender()} else if(a==='leave-case'){state.caseHome=true;rerender()} else if(a==='resume-case'){state.caseHome=false;toast('前回のSessionを復元');rerender()}
    else if(a==='grouping'){pushRoute('GROUPING REASON');showInfoLike('LIKELY SAME EVENT','同じ事業・設備・時間窓を共有するため同一Event候補にまとめた。same_event confidenceはtruth confidenceではない。')}
    else if(a==='resume-step1'){state.phase=1;pushRoute('系統接続工程');rerender()} else if(a==='resume-step2'){state.phase=2;pushRoute('UNKNOWN');rerender()} else if(a==='leave-resume'){state.phase=3;rerender()} else if(a==='resume-session'){state.resumed=true;state.phase=4;toast('前回の位置を復元');rerender()} else if(a==='show-update'){state.updated=true;rerender()}
  });
  function showInfoLike(title,text){const sheet=document.getElementById('sheet');sheet.innerHTML=`<div class="sheet-handle"></div><div class="sheet-head"><small>EPISTEMIC NOTE</small><button class="close-sheet" data-action="close-sheet">×</button></div><h2>${title}</h2><p>${text}</p>`;openSheet()}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
})();
