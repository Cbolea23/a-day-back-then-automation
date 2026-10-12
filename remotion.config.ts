import {Config} from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setTimeoutInMilliseconds(120000);
