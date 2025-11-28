package com.spinlistapp

import android.app.Application
import android.util.Log
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.google.firebase.FirebaseApp

class MainApplication : Application(), ReactApplication {

  companion object {
    private const val TAG = "MainApplication"
  }

  override val reactHost: ReactHost by lazy {
    try {
      getDefaultReactHost(
        context = applicationContext,
        packageList =
          PackageList(this).packages.apply {
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // add(MyReactNativePackage())
          },
      )
    } catch (e: Exception) {
      Log.e(TAG, "Failed to initialize ReactHost", e)
      throw RuntimeException("ReactHost initialization failed", e)
    }
  }

  override fun onCreate() {
    try {
      super.onCreate()
      
      // Validate Firebase initialization
      try {
        FirebaseApp.initializeApp(this)
        Log.i(TAG, "Firebase initialized successfully")
      } catch (e: Exception) {
        Log.e(TAG, "Firebase initialization failed", e)
        // Firebase failure is critical - app won't work without it
        throw RuntimeException("Firebase initialization failed. Please check google-services.json", e)
      }
      
      // Initialize React Native with error handling
      try {
        loadReactNative(this)
        Log.i(TAG, "React Native loaded successfully")
      } catch (e: Exception) {
        Log.e(TAG, "Failed to load React Native", e)
        throw RuntimeException("React Native initialization failed", e)
      }
      
      // Log successful initialization
      Log.i(TAG, "MainApplication initialized successfully")
      
    } catch (e: Exception) {
      Log.e(TAG, "Critical error in MainApplication.onCreate()", e)
      // Re-throw to ensure app doesn't start in broken state
      throw e
    }
  }
}
