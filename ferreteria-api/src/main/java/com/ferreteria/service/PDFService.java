package com.ferreteria.service;

import com.ferreteria.entity.Comprobante;
import com.ferreteria.entity.DetallePedido;
import com.ferreteria.entity.Pedido;
import com.ferreteria.entity.TipoComprobante;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PDFService {

    private final QRCodeService qrCodeService;

    // Paleta de colores Premium
    private static final DeviceRgb COLOR_PRIMARIO = new DeviceRgb(255, 215, 0); // FF D7 00 (Gold)
    private static final DeviceRgb COLOR_TEXTO = new DeviceRgb(33, 33, 33);
    private static final DeviceRgb COLOR_GRIS = new DeviceRgb(128, 128, 128);
    private static final DeviceRgb COLOR_FONDO_SECCION = new DeviceRgb(250, 250, 250);

    public byte[] generateComprobantePDF(Comprobante comprobante) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(30, 40, 30, 40);

            // 1. Encabezado con Diseño Moderno
            addModernHeader(document, comprobante);

            // 2. Información del Cliente
            addInformacionCliente(document, comprobante);

            // 3. Tabla de Productos (Alineada al 100%)
            addTablaDetalles(document, comprobante.getPedido());

            // 4. Totales y QR (Separados para evitar desbordamiento)
            addSeccionFinal(document, comprobante);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error fatal al generar comprobante PDF: " + e.getMessage(), e);
        }
    }

    private void addModernHeader(Document document, Comprobante comprobante) {
        Table header = new Table(UnitValue.createPercentArray(new float[] { 60, 40 })).useAllAvailableWidth();

        // Info Empresa
        Cell infoEmpresa = new Cell().setBorder(Border.NO_BORDER);
        infoEmpresa.add(new Paragraph("FERRETERÍA CARLOS C&C")
                .setFontSize(24).setBold().setFontColor(COLOR_TEXTO).setMarginBottom(0));
        infoEmpresa.add(new Paragraph("RUC: 20123456789")
                .setFontSize(10).setFontColor(COLOR_GRIS).setMarginTop(0));
        infoEmpresa.add(new Paragraph("Av. Los Constructores 123, Lima - Perú\nTel: +51 981 182 158")
                .setFontSize(9).setFontColor(COLOR_GRIS));
        header.addCell(infoEmpresa);

        // Caja del Comprobante
        Cell cajaDoc = new Cell().setBorder(new SolidBorder(COLOR_TEXTO, 1.5f))
                .setBackgroundColor(COLOR_PRIMARIO).setPadding(10)
                .setTextAlignment(TextAlignment.CENTER);
        cajaDoc.add(new Paragraph(
                comprobante.getTipo() == TipoComprobante.FACTURA ? "FACTURA ELECTRÓNICA" : "BOLETA DE VENTA")
                .setBold().setFontSize(14));
        cajaDoc.add(new Paragraph(comprobante.getNumeroComprobante())
                .setBold().setFontSize(18));
        header.addCell(cajaDoc);

        document.add(header);
        document.add(new Paragraph("\n"));
    }

    private void addInformacionCliente(Document document, Comprobante comprobante) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        Table infoTable = new Table(UnitValue.createPercentArray(new float[] { 50, 50 }))
                .useAllAvailableWidth().setBackgroundColor(COLOR_FONDO_SECCION);
        infoTable.setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));

        infoTable.addCell(createLabelValueCell("Adquiriente:", comprobante.getClienteNombre()));
        infoTable.addCell(createLabelValueCell("Fecha Emisión:", comprobante.getFechaEmision().format(dtf)));
        infoTable.addCell(createLabelValueCell(comprobante.getTipo() == TipoComprobante.FACTURA ? "RUC:" : "DNI/Doc:",
                comprobante.getClienteDocumento()));
        infoTable.addCell(createLabelValueCell("Moneda:", "SOLES (S/.)"));

        if (comprobante.getClienteDireccion() != null && !comprobante.getClienteDireccion().isBlank()) {
            infoTable.addCell(createLabelValueCell("Dirección:", comprobante.getClienteDireccion(), 2));
        }

        document.add(infoTable);
        document.add(new Paragraph("\n"));
    }

    private Cell createLabelValueCell(String label, String value) {
        return createLabelValueCell(label, value, 1);
    }

    private Cell createLabelValueCell(String label, String value, int colspan) {
        return new Cell(1, colspan).setBorder(Border.NO_BORDER).setPadding(5)
                .add(new Paragraph().add(new Text(label + " ").setBold().setFontSize(9))
                        .add(new Text(value).setFontSize(9)));
    }

    private void addTablaDetalles(Document document, Pedido pedido) {
        // DEFINICIÓN ULTRA-ESTRICTA DE 4 COLUMNAS
        float[] ratios = { 10f, 50f, 20f, 20f };
        Table table = new Table(UnitValue.createPercentArray(ratios)).useAllAvailableWidth();

        // Header con alineación garantizada
        table.addHeaderCell(createHeaderCol("CANT.", TextAlignment.CENTER));
        table.addHeaderCell(createHeaderCol("DESCRIPCIÓN", TextAlignment.LEFT));
        table.addHeaderCell(createHeaderCol("V. UNIT.", TextAlignment.RIGHT));
        table.addHeaderCell(createHeaderCol("TOTAL", TextAlignment.RIGHT));

        // Datos: Siempre 4 celdas por fila
        for (DetallePedido item : pedido.getDetalles()) {
            // Celda 1: Cantidad
            table.addCell(createDataCol(String.valueOf(item.getCantidad()), TextAlignment.CENTER));

            // Celda 2: Nombre
            table.addCell(createDataCol(item.getProducto().getNombre(), TextAlignment.LEFT));

            // Celda 3: Precio Unitario
            table.addCell(createDataCol("S/. " + String.format("%.2f", item.getPrecioUnitario()), TextAlignment.RIGHT));

            // Celda 4: Total Línea
            BigDecimal subtotal = item.getPrecioUnitario().multiply(new BigDecimal(item.getCantidad()));
            table.addCell(createDataCol("S/. " + String.format("%.2f", subtotal), TextAlignment.RIGHT));
        }

        document.add(table);
    }

    private Cell createHeaderCol(String text, TextAlignment align) {
        return new Cell().add(new Paragraph(text).setBold().setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(COLOR_TEXTO).setTextAlignment(align).setPadding(6).setFontSize(9);
    }

    private Cell createDataCol(String text, TextAlignment align) {
        return new Cell().add(new Paragraph(text)).setTextAlignment(align)
                .setPadding(6).setFontSize(9).setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));
    }

    private void addSeccionFinal(Document document, Comprobante comprobante) {
        Table finalArea = new Table(UnitValue.createPercentArray(new float[] { 65, 35 })).useAllAvailableWidth();
        finalArea.setMarginTop(15);

        // QR y Leyenda
        Cell left = new Cell().setBorder(Border.NO_BORDER);
        if (comprobante.getUrlPublica() != null) {
            try {
                byte[] qr = qrCodeService.generateQRCode(comprobante.getUrlPublica(), 100, 100);
                left.add(new Image(ImageDataFactory.create(qr)));
                left.add(new Paragraph("Escanea para validar el comprobante").setFontSize(7).setFontColor(COLOR_GRIS));
            } catch (Exception ignored) {
            }
        }
        finalArea.addCell(left);

        // Bloque de Totales
        Table totals = new Table(UnitValue.createPercentArray(new float[] { 60, 40 })).useAllAvailableWidth();

        addTotalRow(totals, "OP. GRAVADA:", comprobante.getSubtotal());
        addTotalRow(totals, "IGV (18%):", comprobante.getIgv());
        addTotalRow(totals, "IMP. TOTAL:", comprobante.getTotal()).setBold().setFontSize(11);

        finalArea.addCell(new Cell().setBorder(Border.NO_BORDER).add(totals));

        document.add(finalArea);

        document.add(new Paragraph("\nRepresentación impresa de la " +
                (comprobante.getTipo() == TipoComprobante.FACTURA ? "FACTURA ELECTRÓNICA"
                        : "BOLETA DE VENTA ELECTRÓNICA"))
                .setFontSize(8).setFontColor(COLOR_GRIS).setTextAlignment(TextAlignment.CENTER).setMarginTop(30));
    }

    private Cell addTotalRow(Table table, String label, BigDecimal value) {
        table.addCell(new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT)
                .add(new Paragraph(label).setFontSize(9)));
        Cell valCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT)
                .add(new Paragraph("S/. " + String.format("%.2f", value)).setFontSize(9));
        table.addCell(valCell);
        return valCell;
    }
}
