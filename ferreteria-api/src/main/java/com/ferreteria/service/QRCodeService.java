package com.ferreteria.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class QRCodeService {

    /**
     * Genera un código QR a partir de una URL
     * 
     * @param url    URL que contendrá el código QR
     * @param width  Ancho del QR en pixels
     * @param height Alto del QR en pixels
     * @return Array de bytes de la imagen PNG del QR
     */
    public byte[] generateQRCode(String url, int width, int height) {
        try {
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 1);

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, width, height, hints);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar código QR: " + e.getMessage(), e);
        }
    }

    /**
     * Genera un código QR con tamaño estándar (300x300)
     */
    public byte[] generateQRCode(String url) {
        return generateQRCode(url, 300, 300);
    }
}
