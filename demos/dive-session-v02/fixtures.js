(() => {
  'use strict';

  const sources = {
    visual: {
      id: 'src-visual',
      name: 'Coastal Visual Verification Desk',
      title: 'Multi-angle video verification set for the coastal generation facility incident',
      publishedAt: '2026-08-16 00:31 UTC',
      type: 'independent visual verification',
      url: 'https://example.invalid/demo/visual'
    },
    satellite: {
      id: 'src-satellite',
      name: 'Orbital Infrastructure Observation Collaborative — Long-Form Source Name Stress Fixture',
      title: 'Post-incident satellite imagery and capture metadata, coastal power generation complex',
      publishedAt: '2026-08-16 00:48 UTC',
      type: 'satellite imagery',
      url: 'https://example.invalid/demo/satellite'
    },
    grid: {
      id: 'src-grid',
      name: 'Regional Grid System Operator',
      title: 'Generation availability and reserve status bulletin',
      publishedAt: '2026-08-16 00:36 UTC',
      type: 'first-party operations notice',
      url: 'https://example.invalid/demo/grid'
    },
    government: {
      id: 'src-government',
      name: 'Government Press Office',
      title: 'Statement concerning the coastal generation facility incident',
      publishedAt: '2026-08-16 00:27 UTC',
      type: 'first-party claim',
      url: 'https://example.invalid/demo/government'
    },
    archive: {
      id: 'src-archive',
      name: 'Independent Infrastructure Incident Archive',
      title: '2024 attack on a comparable energy facility: chronology, damage and operational recovery',
      publishedAt: '2024-05-19',
      type: 'historical archive',
      url: 'https://example.invalid/demo/archive'
    },
    technical: {
      id: 'src-technical',
      name: 'Civil Infrastructure Resilience Research Unit',
      title: 'Navigation, guidance and infrastructure vulnerability in long-range unmanned systems',
      publishedAt: '2026-06-02',
      type: 'technical context',
      url: 'https://example.invalid/demo/technical'
    }
  };

  const nodes = {
    event: { id:'event', type:'EVENT', title:'沿岸部の発電施設爆発', question:'何が起き、何がまだ分からない？', description:'爆発・火災・出力低下は確認されている。原因、攻撃主体、兵器種は独立確認されていない。', sourceIds:['src-visual','src-grid','src-government'] },
    evidence: { id:'evidence', type:'EVIDENCE', title:'何が根拠になっている？', question:'観測材料を分けて確かめる', description:'映像・衛星画像・運転情報を、主張とは分けて見る。', sourceIds:['src-visual','src-satellite','src-grid'] },
    claims: { id:'claims', type:'CLAIMS', title:'誰が何を主張している？', question:'発言主体と検証状態を分ける', description:'政府の主張と、それを裏づける公開材料を別々に見る。', sourceIds:['src-government'] },
    unknown: { id:'unknown', type:'UNKNOWN', title:'まだ何が分からない？', question:'未確認の範囲を残す', description:'原因、攻撃主体、兵器種、長期損傷は現時点で未確認。', sourceIds:['src-visual','src-government'] },
    history: { id:'history', type:'HISTORY', title:'過去に似たことは？', question:'似ている点と違う点を比較する', description:'過去の類似施設攻撃は文脈になるが、今回の事件の証拠ではない。', sourceIds:['src-archive'] },
    people: { id:'people', type:'PEOPLE', title:'誰が判断や説明に関わる？', question:'情報を出す主体を追う', description:'政府、系統運用者、現地検証者など、役割の違う主体を見る。', sourceIds:['src-government','src-grid','src-visual'] },
    technology: { id:'technology', type:'TECHNOLOGY', title:'どんな技術が関係する？', question:'技術条件を事件の確定事実と分ける', description:'無人機説を前提にせず、航法・誘導・防護の一般条件を見る。', sourceIds:['src-technical'] },
    impact: { id:'impact', type:'IMPACT', title:'何に影響する？', question:'停止が続いた場合の波及を確認する', description:'電力供給、予備力、港湾運用への影響は停止時間によって変わる。', sourceIds:['src-grid'] },

    satellite: { id:'satellite', type:'EVIDENCE', title:'衛星画像', question:'画像から何が確認できる？', description:'損傷位置と撮影時刻は確認できるが、爆発原因は画像だけでは確定できない。', sourceIds:['src-satellite'] },
    groundVideo: { id:'groundVideo', type:'EVIDENCE', title:'現地映像', question:'映像は何を示す？', description:'爆発と煙は見えるが、飛来物の種類は不鮮明。', sourceIds:['src-visual'] },
    operations: { id:'operations', type:'EVIDENCE', title:'運転情報', question:'出力変化は時刻と一致する？', description:'系統運用者が同時刻帯の発電出力低下を報告している。', sourceIds:['src-grid'] },
    captureTime: { id:'captureTime', type:'EVIDENCE', title:'撮影時刻', question:'他の時刻情報と整合する？', description:'撮像時刻は現地映像と運転低下の時刻帯に近い。', sourceIds:['src-satellite','src-grid'] },
    damageLocation: { id:'damageLocation', type:'EVIDENCE', title:'損傷位置', question:'どの設備に変化が見える？', description:'外観上の損傷はタービン棟付近に集中して見える。', sourceIds:['src-satellite'] },
    history2024: { id:'history2024', type:'HISTORY', title:'2024年の類似施設攻撃', question:'何が似て、何が違う？', description:'重要インフラへの被害という共通点がある。一方、今回の原因や攻撃主体を示す証拠にはならない。', sourceIds:['src-archive'] },
    recovery2024: { id:'recovery2024', type:'HISTORY', title:'復旧に要した時間', question:'過去の停止はどのくらい続いた？', description:'過去事例では損傷部位により復旧期間が大きく異なった。今回の停止期間の予測根拠ではなく比較材料。', sourceIds:['src-archive'] },
    govClaim: { id:'govClaim', type:'CLAIM', title:'政府「無人機による攻撃」', question:'何が主張され、何が検証済み？', description:'政府が無人機攻撃と発表したことは確認できる。命題そのものは独立確認されていない。', sourceIds:['src-government'] },
    claimEvidenceGap: { id:'claimEvidenceGap', type:'UNKNOWN', title:'公開根拠の不足', question:'主張を独立検証するには何が足りない？', description:'兵器残骸、追跡情報、独立映像などが公開されていない。', sourceIds:['src-government','src-visual'] },
    navigation: { id:'navigation', type:'TECHNOLOGY', title:'航法・誘導', question:'長距離飛行にはどんな条件が必要？', description:'衛星航法、慣性航法、地形・画像照合などが一般的な候補になる。これは今回使用された技術の断定ではない。', sourceIds:['src-technical'] },
    infrastructure: { id:'infrastructure', type:'TECHNOLOGY', title:'施設の脆弱点', question:'設備構成は被害の広がりにどう関係する？', description:'変圧設備やタービン関連設備は損傷箇所によって復旧難度が変わる。', sourceIds:['src-technical','src-grid'] },
    gridImpact: { id:'gridImpact', type:'IMPACT', title:'電力系統への影響', question:'供給余力はどう変わる？', description:'停止が長引くほど予備力の使用や代替調達が増える可能性がある。', sourceIds:['src-grid'] },
    analystRoles: { id:'analystRoles', type:'PEOPLE', title:'検証する人々', question:'誰が何を確認できる？', description:'現地映像検証、系統運用、衛星観測はそれぞれ確認できる範囲が違う。', sourceIds:['src-visual','src-grid','src-satellite'] }
  };

  const links = {
    event: [
      ['evidence','supports','根拠を見に行く','観測材料を分けて確認する方向。',['src-visual','src-satellite','src-grid']],
      ['claims','claims','主張を見に行く','誰が何を述べているかを、検証状態と分けて見る。',['src-government']],
      ['unknown','context_for','未確認点を見る','確定していない範囲を事件理解の前提として見る。',['src-visual','src-government']],
      ['history','historically_similar_to','過去と比較する','過去の類似事例を比較する。今回の事件の証拠ではない。',['src-archive']],
      ['people','context_for','関係する主体を見る','情報を出す人・組織の役割を見る。',['src-government','src-grid','src-visual']],
      ['technology','explains','技術条件を見る','技術的な可能条件を、事件の確定事実とは分けて見る。',['src-technical']],
      ['impact','affects','影響を見る','施設停止が周辺システムへ与える影響を見る。',['src-grid']]
    ],
    evidence: [
      ['satellite','supports','衛星画像を見る','画像は損傷位置を確かめる材料の一つ。',['src-satellite']],
      ['groundVideo','supports','現地映像を見る','映像は爆発・煙の発生を裏づける。',['src-visual']],
      ['operations','confirms','運転情報を見る','運転低下の時刻は事件発生時刻帯と整合する。',['src-grid']],
      ['unknown','context_for','限界も確認する','観測材料で確定できない範囲を同時に見る。',['src-visual','src-government']]
    ],
    satellite: [
      ['captureTime','confirms','撮影時刻を確認','撮影時刻と他の時刻情報の整合を見る。',['src-satellite','src-grid']],
      ['damageLocation','supports','損傷位置を見る','画像上の損傷箇所を詳しく見る。',['src-satellite']],
      ['history','historically_similar_to','過去と横に比較','損傷形態を過去事例と比較する。今回の原因の証拠ではない。',['src-satellite','src-archive']],
      ['technology','context_for','技術条件へ移る','画像で見える損傷から、一般的な設備・技術条件へ横移動する。',['src-satellite','src-technical']],
      ['unknown','context_for','画像の限界を見る','画像だけでは原因・主体・兵器種を確定できない。',['src-satellite']]
    ],
    history: [
      ['history2024','historically_similar_to','2024年事例を見る','重要インフラ被害という共通点を比較する。今回事件の証拠ではない。',['src-archive']],
      ['recovery2024','context_for','復旧時間を比較','過去の復旧期間を背景情報として見る。',['src-archive']],
      ['technology','context_for','技術条件へ横移動','過去事例で問題になった技術条件を一般論として見る。',['src-archive','src-technical']],
      ['impact','context_for','影響へ横移動','過去の停止がどんな影響を生んだか比較する。',['src-archive','src-grid']]
    ],
    claims: [
      ['govClaim','claims','政府の主張を見る','政府が何を述べたかを確認する。',['src-government']],
      ['claimEvidenceGap','context_for','公開根拠の不足を見る','主張の存在と命題の検証を分離する。',['src-government','src-visual']],
      ['evidence','context_for','独立材料と比べる','主張と観測材料を並べて見る。',['src-government','src-visual']]
    ],
    unknown: [
      ['claimEvidenceGap','context_for','何が足りないかを見る','未確認点を検証するために必要な材料を整理する。',['src-government','src-visual']],
      ['evidence','context_for','今ある材料へ戻る','不足点を現在の観測材料と照合する。',['src-visual','src-satellite']]
    ],
    technology: [
      ['navigation','explains','航法・誘導を見る','長距離無人システムに一般的に関係する技術条件。今回使用された技術の断定ではない。',['src-technical']],
      ['infrastructure','technical_dependency','施設構成を見る','設備構成が損傷・復旧にどう関係するかを見る。',['src-technical','src-grid']],
      ['history','context_for','過去の事例へ移る','過去事例で技術条件がどう現れたか比較する。',['src-technical','src-archive']]
    ],
    impact: [
      ['gridImpact','affects','系統影響を見る','停止時間と供給余力の関係を見る。',['src-grid']],
      ['history','context_for','過去の影響と比べる','過去事例の波及を比較材料として見る。',['src-grid','src-archive']]
    ],
    people: [
      ['analystRoles','explains','検証役割を見る','主体ごとに確認できる範囲が違うことを見る。',['src-visual','src-grid','src-satellite']],
      ['claims','context_for','発言主体へ移る','誰が何を言っているかへ移る。',['src-government']]
    ],
    history2024: [['history','historically_similar_to','比較全体へ戻る','過去事例群へ戻る。今回事件の証拠ではない。',['src-archive']]],
    recovery2024: [['history','context_for','比較全体へ戻る','復旧期間の比較を過去文脈へ戻す。',['src-archive']]],
    govClaim: [['claims','claims','主張一覧へ戻る','主張主体の文脈へ戻る。',['src-government']],['evidence','context_for','独立材料を見る','主張と観測材料を比較する。',['src-government','src-visual']]],
    claimEvidenceGap: [['unknown','context_for','未確認点へ戻る','不足する根拠を未確認事項の文脈へ戻す。',['src-government','src-visual']]],
    navigation: [['technology','explains','技術全体へ戻る','航法を技術条件全体へ戻す。',['src-technical']]],
    infrastructure: [['technology','technical_dependency','技術全体へ戻る','設備構成を技術文脈へ戻す。',['src-technical','src-grid']]],
    gridImpact: [['impact','affects','影響全体へ戻る','系統影響を波及全体へ戻す。',['src-grid']]],
    analystRoles: [['people','explains','主体全体へ戻る','検証役割を関係主体の文脈へ戻す。',['src-visual','src-grid','src-satellite']]],
    groundVideo: [['evidence','context_for','根拠全体へ戻る','現地映像を他の根拠と並べる。',['src-visual']]],
    operations: [['evidence','confirms','根拠全体へ戻る','運転情報を根拠全体へ戻す。',['src-grid']]],
    captureTime: [['satellite','confirms','衛星画像へ戻る','撮影時刻を画像検証へ戻す。',['src-satellite','src-grid']]],
    damageLocation: [['satellite','supports','衛星画像へ戻る','損傷位置を画像検証へ戻す。',['src-satellite']]]
  };

  function edgeId(from, to, relation) { return `rel:${from}:${relation}:${to}`; }
  function directions(nodeId) {
    return (links[nodeId] || []).map(([to, relationType, label, explanation, sourceIds]) => ({
      id: edgeId(nodeId, to, relationType),
      fromNodeId: nodeId,
      toNodeId: to,
      relationType,
      label,
      explanation,
      sourceIds,
      evidenceIds: []
    }));
  }
  function relationById(id) {
    for (const from of Object.keys(links)) {
      const r = directions(from).find(x => x.id === id);
      if (r) return r;
    }
    return null;
  }

  const relationPlain = {
    supports:'根拠として支える', contradicts:'反する材料', claims:'〜と主張している', confirms:'別の材料と一致する',
    source_of:'情報源', context_for:'理解するための文脈', historically_similar_to:'歴史的に似ている', affects:'影響する',
    caused_by:'原因として関係する', part_of:'一部である', explains:'仕組みを説明する', technical_dependency:'技術的に依存する'
  };

  window.DiveFixture = { sources, nodes, directions, relationById, relationPlain };
})();
