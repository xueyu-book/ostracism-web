export const defaultCardDetail = {
  identity: '大参林会员',
  scope: '全国',
  benefits: '4积分、折扣商品4积分、折扣商品4积分、折扣商品4积分、折扣商品4积分。',
  expiry: '20xx年xx月xx日',
  difficulty: '正常',
  difficultyLevel: 'mid'
}

export function getCardDetail(cardId) {
  return {
    ...defaultCardDetail,
    id: cardId
  }
}
