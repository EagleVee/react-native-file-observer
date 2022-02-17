package com.fileobserver;
import android.net.Uri;
import android.os.Environment;
import android.os.FileObserver;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;


public class FileObserverModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private FileObserver observer;

    FileObserverModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           String params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public String mReadJsonData(String path) {
        try {
            File f = new File(path);
            FileInputStream is = new FileInputStream(f);
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            String mResponse = new String(buffer);
            return mResponse;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return "{}";
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "FileObserverModule";
    }


    @ReactMethod
    public void initWatchFile(String path, String eventFireName) {
        // set up a file observer to watch this directory
        // check that it's not equal to .probe because thats created every time camera is launched
        observer = new FileObserver(path, FileObserver.ALL_EVENTS) { // set up a file observer to watch this directory
            @Override
            public void onEvent(int event, final String file) {
                if (event == FileObserver.CLOSE_WRITE || event == FileObserver.DELETE) {
                    String content = mReadJsonData(path);
                    sendEvent(reactContext, eventFireName, content);
                }
            }
        };
    }

    @ReactMethod
    public void clearFileToEmptyObject(String path) {
        try {
            FileWriter file = new FileWriter(path);
            file.write("{}");
            file.flush();
            file.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Set up any upstream listeners or background tasks as necessary
        Log.d("FILE_OBSERVER", "addListener");
        observer.startWatching();
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
        Log.d("FILE_OBSERVER", "removeListeners");
        observer.stopWatching();
    }

}
