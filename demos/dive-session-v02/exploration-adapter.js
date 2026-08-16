(() => {
  'use strict';
  class FixtureExplorationAdapter {
    getNode(nodeId) { return window.DiveFixture.nodes[nodeId] || null; }
    getDirections(nodeId) { return window.DiveFixture.directions(nodeId); }
    getRelation(relationId) { return window.DiveFixture.relationById(relationId); }
    getSource(sourceId) { return Object.values(window.DiveFixture.sources).find(s => s.id === sourceId) || null; }
    relationPlain(relationType) { return window.DiveFixture.relationPlain[relationType] || relationType; }
    getSuggestedOpenQuestion(nodeId) {
      const custom = {
        event:'原因・攻撃主体・兵器種について、独立した新しい証拠が出たときに、この事件の見方はどの部分から更新されるべきか？',
        evidence:'現在ある映像・衛星画像・運転情報のうち、どの材料が独立していて、どの材料は同じ情報源に依存しているのか？',
        satellite:'衛星画像で確認できる損傷位置と、政府が主張する攻撃方法を結びつけるためには、どの追加証拠が必要なのか？',
        history:'過去の類似施設攻撃と今回の事件で、似ている点ではなく「違う点」を先に比較すると、どの仮説を弱められるのか？',
        technology:'技術的に可能であることと、今回その技術が実際に使われたことを区別するには、何を確認すべきか？',
        claims:'政府の主張のうち、発言の存在は確認できても内容が未検証の部分はどこで、独立確認には何が必要か？',
        unknown:'現在「UNKNOWN」とされている原因・攻撃主体・兵器種のうち、どの項目に最初に新しい一次資料が出る可能性があり、出た場合どのsourceを確認すべきか？'
      };
      return custom[nodeId] || `「${this.getNode(nodeId)?.title || 'この項目'}」について、あとで新しい証拠や一次資料が出たときに何を確認したい？`;
    }
  }
  window.FixtureExplorationAdapter = FixtureExplorationAdapter;
})();
