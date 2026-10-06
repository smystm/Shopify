const PRODUCT_IMAGE_BY_TITLE = Object.freeze({
  ak47: '/images/weapons/ak47.svg',
  glock18: '/images/weapons/glock.svg',
  p2000: '/images/weapons/p2000.svg',
  usps: '/images/weapons/usp_silencer.svg',
  p250: '/images/weapons/p250.svg',
  deserteagle: '/images/weapons/deagle.svg',
  fiveseven: '/images/weapons/fiveseven.svg',
  tec9: '/images/weapons/tec9.svg',
  dualberettas: '/images/weapons/elite.svg',
  cz75auto: '/images/weapons/cz75a.svg',
  r8revolver: '/images/weapons/revolver.svg',
  mac10: '/images/weapons/mac10.svg',
  mp9: '/images/weapons/mp9.svg',
  mp7: '/images/weapons/mp7.svg',
  mp5sd: '/images/weapons/mp5sd.svg',
  p90: '/images/weapons/p90.svg',
  ump45: '/images/weapons/ump45.svg',
  ppbizon: '/images/weapons/bizon.svg',
  m4a4: '/images/weapons/m4a1.svg',
  m4a1s: '/images/weapons/m4a1_silencer.svg',
  aug: '/images/weapons/aug.svg',
  sg553: '/images/weapons/sg556.svg',
  famas: '/images/weapons/famas.svg',
  galilar: '/images/weapons/galilar.svg',
  awp: '/images/weapons/awp.svg',
  ssg08: '/images/weapons/ssg08.svg',
  scar20: '/images/weapons/scar20.svg',
  g3sg1: '/images/weapons/g3sg1.svg',
  m249: '/images/weapons/m249.svg',
  negev: '/images/weapons/negev.svg',
  nova: '/images/weapons/nova.svg',
  xm1014: '/images/weapons/xm1014.svg',
  mag7: '/images/weapons/mag7.svg',
  sawedoff: '/images/weapons/sawedoff.svg',
});

function productImageForTitle(title) {
  const normalizedTitle = String(title ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return PRODUCT_IMAGE_BY_TITLE[normalizedTitle] ?? null;
}

module.exports = { productImageForTitle };
