import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props: any) => {
  let config: any = {};
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const Html5QrcodePlugin = (props: any) => {
  const [qrScanner, setQrScanner] = useState<any>(null);

  useEffect(() => {
    // when component mounts
    const config: any = createConfig(props);
    console.log(config);
    const verbose = props.verbose === true;
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );

    setQrScanner(html5QrcodeScanner);

    // html5QrcodeScanner.render(
    //   props.qrCodeSuccessCallback,
    //   props.qrCodeErrorCallback
    // );

    // // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  useEffect(() => {
    if (qrScanner) {
      if (props.show) {
        console.log("kamera acik");
        qrScanner.render(
          props.qrCodeSuccessCallback,
          props.qrCodeErrorCallback
        );
      } else {
        console.log("kamera kapali");

        qrScanner.clear().catch((error: any) => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    }
  }, [props.show]);

  return <div id={qrcodeRegionId} className="w-[600px] h-[500px]" />;
};

export default Html5QrcodePlugin;
