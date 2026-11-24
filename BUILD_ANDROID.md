# Construcción Android (APK)
1. Instalar Node.js LTS, Ionic CLI (`npm install -g @ionic/cli`) y Android Studio con Android SDK.
2. Ejecutar `npm install`.
3. Instalar Capacitor: `npm install @capacitor/core @capacitor/cli @capacitor/android`.
4. Ejecutar `ionic build`.
5. Ejecutar `npx cap init Cuentaconmigo com.example.cuentaconmigo --web-dir www` (si aún no existe la configuración).
6. Ejecutar `npx cap add android` y `npx cap sync android`.
7. `npx cap open android`; en Android Studio usar Build > Build APK(s).

El APK no se puede afirmar como construido hasta completar estos pasos en un entorno con SDK y validar en dispositivo/emulador.
