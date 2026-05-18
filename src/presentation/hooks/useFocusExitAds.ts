import { useState, useCallback } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const AD_UNIT_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';

function showOneInterstitial(): Promise<void> {
  return new Promise((resolve, reject) => {
    const ad = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      ad.show();
    });

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      unsubLoaded();
      unsubClosed();
      unsubError();
      resolve();
    });

    const unsubError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      unsubLoaded();
      unsubClosed();
      unsubError();
      reject(error);
    });

    ad.load();
  });
}

export function useFocusExitAds() {
  const [loadingAds, setLoadingAds] = useState(false);

  const showTwoAds = useCallback(async (): Promise<boolean> => {
    setLoadingAds(true);
    try {
      await showOneInterstitial();
      await showOneInterstitial();
      return true;
    } catch {
      return false;
    } finally {
      setLoadingAds(false);
    }
  }, []);

  return { showTwoAds, loadingAds };
}
