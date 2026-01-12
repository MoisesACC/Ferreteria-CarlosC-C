package com.ferreteria.service;

import com.ferreteria.entity.Comprobante;
import com.ferreteria.entity.DetallePedido;
import com.ferreteria.entity.Pedido;
import com.ferreteria.entity.TipoComprobante;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.HorizontalAlignment;
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

    // Paleta Hydra Company / Premium
    private static final DeviceRgb COLOR_AMBAR = new DeviceRgb(255, 195, 0);
    private static final DeviceRgb COLOR_NEGRO = new DeviceRgb(0, 0, 0);
    private static final DeviceRgb COLOR_GRIS_OSCURO = new DeviceRgb(60, 60, 60);

    public byte[] generateComprobantePDF(Comprobante comprobante) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            // Formato A4 pero con estructura de ticket organizada
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(20, 50, 20, 50);

            // 1. Logo y Datos de Empresa (Centrados estilo Hydra)
            addCompanyHeader(document);

            // 2. Título del Documento y Número
            addDocumentTitle(document, comprobante);

            // 3. Información del Cliente
            addClientInfo(document, comprobante);

            // 4. Tabla de Productos
            addProductsTable(document, comprobante.getPedido());

            // 5. Totales y Leyenda
            addTotalsAndFooter(document, comprobante);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF: " + e.getMessage(), e);
        }
    }

    private void addCompanyHeader(Document document) {
        // Contenedor Negro para "Logo" simulado
        Table logoTable = new Table(1).setHorizontalAlignment(HorizontalAlignment.CENTER);
        Cell logoCell = new Cell().add(new Paragraph("\nCOMPANY FERRETERIA")
                .setBold().setFontSize(22).setFontColor(COLOR_AMBAR)
                .setTextAlignment(TextAlignment.CENTER))
                .setBackgroundColor(COLOR_NEGRO)
                .setPadding(10).setWidth(180);
        logoTable.addCell(logoCell);
        document.add(logoTable);

        // Datos Empresa
        document.add(new Paragraph("FERRETERÍA CARLOS C&C")
                .setBold().setFontSize(14).setTextAlignment(TextAlignment.CENTER).setMarginTop(10));
        document.add(new Paragraph(
                "RUC: 20612345678\nCALLE LAS NORMAS 123 - LIMA\nTelf: 981 182 158\nWeb: https://ferrecarlos.up.railway.app/")
                .setFontSize(9).setTextAlignment(TextAlignment.CENTER).setFontColor(COLOR_GRIS_OSCURO)
                .setMarginTop(-5));

        document.add(new Paragraph("\n"));
    }

    private void addDocumentTitle(Document document, Comprobante comprobante) {
        String titulo = (comprobante.getTipo() == TipoComprobante.FACTURA ? "FACTURA" : "BOLETA DE VENTA")
                + " ELECTRÓNICA";
        document.add(new Paragraph(titulo)
                .setBold().setFontSize(14).setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph(comprobante.getNumeroComprobante())
                .setBold().setFontSize(16).setTextAlignment(TextAlignment.CENTER).setMarginTop(-5));

        document.add(new Paragraph("\n"));
    }

    private void addClientInfo(Document document, Comprobante comprobante) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        Table info = new Table(UnitValue.createPercentArray(new float[] { 20, 80 })).useAllAvailableWidth();
        info.setBorder(Border.NO_BORDER);

        addInfoRow(info, "CLIENTE:", comprobante.getClienteNombre());
        addInfoRow(info, "DNI/RUC:", comprobante.getClienteDocumento());
        addInfoRow(info, "FECHA:", comprobante.getFechaEmision().format(dtf));
        if (comprobante.getClienteDireccion() != null && !comprobante.getClienteDireccion().isEmpty()) {
            addInfoRow(info, "DIRECCIÓN:", comprobante.getClienteDireccion());
        }

        document.add(info);
        document.add(new Paragraph("\n"));
    }

    private void addInfoRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label).setBold().setFontSize(9)).setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph(value).setFontSize(9)).setBorder(Border.NO_BORDER));
    }

    private void addProductsTable(Document document, Pedido pedido) {
        Table table = new Table(UnitValue.createPercentArray(new float[] { 10, 55, 17, 18 })).useAllAvailableWidth();

        // Header simple con líneas arriba y abajo
        table.addHeaderCell(new Cell().add(new Paragraph("CANT")).setBold().setFontSize(9).setBorder(Border.NO_BORDER)
                .setBorderTop(new SolidBorder(1)).setBorderBottom(new SolidBorder(1)));
        table.addHeaderCell(new Cell().add(new Paragraph("DESCRIPCIÓN")).setBold().setFontSize(9)
                .setBorder(Border.NO_BORDER).setBorderTop(new SolidBorder(1)).setBorderBottom(new SolidBorder(1)));
        table.addHeaderCell(new Cell().add(new Paragraph("P. UNIT")).setBold().setFontSize(9)
                .setBorder(Border.NO_BORDER).setBorderTop(new SolidBorder(1)).setBorderBottom(new SolidBorder(1))
                .setTextAlignment(TextAlignment.RIGHT));
        table.addHeaderCell(new Cell().add(new Paragraph("TOTAL")).setBold().setFontSize(9).setBorder(Border.NO_BORDER)
                .setBorderTop(new SolidBorder(1)).setBorderBottom(new SolidBorder(1))
                .setTextAlignment(TextAlignment.RIGHT));

        for (DetallePedido item : pedido.getDetalles()) {
            table.addCell(new Cell().add(new Paragraph(String.valueOf(item.getCantidad()))).setFontSize(9)
                    .setBorder(Border.NO_BORDER).setPaddingTop(5));
            String nombreProd = (item.getProducto() != null && item.getProducto().getNombre() != null)
                    ? item.getProducto().getNombre()
                    : "Producto sin descripción";
            table.addCell(new Cell().add(new Paragraph(nombreProd)).setFontSize(9)
                    .setBorder(Border.NO_BORDER).setPaddingTop(5));
            table.addCell(new Cell().add(new Paragraph(String.format("%.2f", item.getPrecioUnitario()))).setFontSize(9)
                    .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT).setPaddingTop(5));

            BigDecimal total = item.getPrecioUnitario().multiply(new BigDecimal(item.getCantidad()));
            table.addCell(new Cell().add(new Paragraph(String.format("%.2f", total))).setFontSize(9)
                    .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT).setPaddingTop(5));
        }

        // Línea final de tabla
        table.addCell(new Cell(1, 4).setBorder(Border.NO_BORDER).setBorderBottom(new SolidBorder(1)).setHeight(5));
        document.add(table);
    }

    private void addTotalsAndFooter(Document document, Comprobante comprobante) {
        Table totals = new Table(UnitValue.createPercentArray(new float[] { 70, 30 })).useAllAvailableWidth();
        totals.setMarginTop(10);

        addTotalRow(totals, "OP. GRAVADA", comprobante.getSubtotal());
        addTotalRow(totals, "I.G.V (18%)", comprobante.getIgv());
        addTotalRow(totals, "TOTAL S/", comprobante.getTotal(), true);

        document.add(totals);

        // Monto en letras (Simulado para el ejemplo)
        document.add(new Paragraph("\nSON: " + convertirMontoLetras(comprobante.getTotal()) + " SOLES")
                .setFontSize(9).setBold());

        // QR Centrado
        if (comprobante.getUrlPublica() != null) {
            try {
                byte[] qr = qrCodeService.generateQRCode(comprobante.getUrlPublica(), 120, 120);
                Image qrImg = new Image(ImageDataFactory.create(qr)).setHorizontalAlignment(HorizontalAlignment.CENTER)
                        .setMarginTop(20);
                document.add(qrImg);
            } catch (Exception ignored) {
            }
        }

        document.add(new Paragraph("\nRepresentación impresa de la Venta Electrónica\nConsulte en www.ferrecarlos.com")
                .setFontSize(8).setTextAlignment(TextAlignment.CENTER).setFontColor(COLOR_GRIS_OSCURO)
                .setMarginTop(10));
    }

    private void addTotalRow(Table table, String label, BigDecimal value) {
        addTotalRow(table, label, value, false);
    }

    private void addTotalRow(Table table, String label, BigDecimal value, boolean isBold) {
        Cell labelCell = new Cell().add(new Paragraph(label)).setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT).setFontSize(10);
        Cell valueCell = new Cell().add(new Paragraph(String.format("%.2f", value))).setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT).setFontSize(10);

        if (isBold) {
            labelCell.setBold();
            valueCell.setBold();
        }

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private String convertirMontoLetras(BigDecimal monto) {
        // Método simplificado - En producción usar una librería tipo humanize o similar
        return "CIENTO CINCUENTA Y NUEVE CON 00/100";
    }
}
