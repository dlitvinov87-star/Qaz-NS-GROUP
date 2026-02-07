#!/bin/bash
# Download product images from arkasnab.kz catalog

BASE_DIR="$(cd "$(dirname "$0")" && pwd)/images/catalog"
mkdir -p "$BASE_DIR"
TOTAL=0

download_category() {
  local SLUG="$1"
  local FOLDER="$2"
  local DIR="$BASE_DIR/$FOLDER"
  mkdir -p "$DIR"

  echo "=== $FOLDER ($SLUG) ==="

  ALL_URLS=""
  for PAGE in 1 2 3 4 5; do
    if [ "$PAGE" -eq 1 ]; then
      URL_PAGE="https://arkasnab.kz/product-category/$SLUG/"
    else
      URL_PAGE="https://arkasnab.kz/product-category/$SLUG/page/$PAGE/"
    fi

    URLS=$(curl -s "$URL_PAGE" \
      | grep -oE 'https://arkasnab\.kz/wp-content/uploads/[0-9]+/[0-9]+/[^"'"'"' >]+\.(jpg|jpeg|png|webp)' \
      | grep -v 'cropped-' \
      | grep -v 'res_ban' \
      | grep -v 'elementor' \
      | grep -v 'ac_assets' \
      | grep -vE '\-[0-9]+x[0-9]+\.' \
      | sort -u)

    if [ -z "$URLS" ] && [ "$PAGE" -gt 1 ]; then
      break
    fi
    ALL_URLS="$ALL_URLS
$URLS"
  done

  ALL_URLS=$(echo "$ALL_URLS" | grep -v '^$' | sort -u)

  COUNT=0
  while IFS= read -r IMG_URL; do
    [ -z "$IMG_URL" ] && continue
    FILENAME=$(basename "$IMG_URL")
    if [ ! -f "$DIR/$FILENAME" ]; then
      curl -s -o "$DIR/$FILENAME" "$IMG_URL"
      echo "  + $FILENAME"
    fi
    COUNT=$((COUNT + 1))
  done <<< "$ALL_URLS"

  echo "  => $COUNT images"
  TOTAL=$((TOTAL + COUNT))
}

download_category "vetosh-obtirochnoe-netkannoe-polotno" "vetosh"
download_category "vodoemulsionnye-kraski-favorit" "favorit"
download_category "zashhitnye-ochki" "ochki"
download_category "kraski-organicheskie" "kraski-organic"
download_category "meshki-stroitelnye-musornye" "meshki"
download_category "opz-met-o-ognezashhitnaya-kraska-dlya-metalla" "opz-met-o"
download_category "perchatki" "perchatki"
download_category "plenka-vozdushno-puzyrchataya-100mh1-2m-tolshhina-5-mm" "plenka-puzyrchataya"
download_category "plenka-prozrachnaya-polietilenovaya" "plenka-tekhnicheskaya"
download_category "podshlemniki-shapki-balaklavy" "podshlemniki"
download_category "rashodnye-materialy-diski" "diski"
download_category "spetsodezhda" "specodezhda"
download_category "sredstva-zashhity-golovy" "zashchita-golovy"
download_category "sredstva-zashhity-organov-dyhaniya-maski-respiratory" "zashchita-dykhaniya"
download_category "klej-germetik" "klej-sanz"

echo ""
echo "=============================="
echo "DONE! Total: $TOTAL images"
echo "Location: $BASE_DIR"
echo "=============================="
