var EventEmitter = require('events').EventEmitter;

/**
* Pure-JS implementation of WebTV's LZPF compression
*
* This is a port of my Lzpf compression code from my ROMFS Python tool
* Originally reverse engineered from the box
*
* By: Eric MacDonald (eMac)
*/

class WTVLzpf {
    // Note: currentlty doesn't offer optimal streaming support but this is good enough to meet perf demands at the scale we're at.

    current_length = 0;
    current_literal = 0;
    flag = 0xFFFF;
    working_data = 0;
    match_index = 0;
    type_index = 0;
    checksum = 0;
    flag_table = new Uint16Array(0x1000)
    ring_buffer = new Uint8Array(0x2000)
    compressed_data = [];

    nomatchEncode = [
        [0x0000, 0x10], [0x0001, 0x10], [0x0002, 0x10], 
        [0x0003, 0x10], [0x0004, 0x10], [0x009A, 0x0F], 
        [0x0005, 0x10], [0x009C, 0x0F], [0x009E, 0x0F], 
        [0x3400, 0x06], [0x7000, 0x05], [0x00A0, 0x0F], 
        [0x0006, 0x10], [0x0380, 0x09], [0x0007, 0x10], 
        [0x0008, 0x10], [0x0009, 0x10], [0x000A, 0x10], 
        [0x000B, 0x10], [0x000C, 0x10], [0x000D, 0x10], 
        [0x000E, 0x10], [0x000F, 0x10], [0x00A2, 0x0F], 
        [0x0010, 0x10], [0x0011, 0x10], [0x0012, 0x10], 
        [0x0013, 0x10], [0x0014, 0x10], [0x0015, 0x10], 
        [0x0016, 0x10], [0x0017, 0x10], [0xE000, 0x04], 
        [0x0200, 0x0A], [0x7800, 0x05], [0x0400, 0x09], 
        [0x00B0, 0x0E], [0x0018, 0x10], [0x0120, 0x0B], 
        [0x0480, 0x09], [0x0140, 0x0B], [0x0160, 0x0B], 
        [0x0240, 0x0A], [0x00B8, 0x0D], [0x1400, 0x07], 
        [0x1600, 0x07], [0x3800, 0x06], [0x8000, 0x05], 
        [0x0A00, 0x08], [0x1800, 0x07], [0x0B00, 0x08], 
        [0x0500, 0x09], [0x0C00, 0x08], [0x0580, 0x09], 
        [0x0600, 0x09], [0x0680, 0x09], [0x0700, 0x09], 
        [0x0780, 0x09], [0x0D00, 0x08], [0x0180, 0x0B], 
        [0x8800, 0x05], [0x3C00, 0x06], [0x9000, 0x05], 
        [0x0280, 0x0A], [0x00B4, 0x0E], [0x4000, 0x06], 
        [0x1A00, 0x07], [0x1C00, 0x07], [0x1E00, 0x07], 
        [0x4400, 0x06], [0x2000, 0x07], [0x2200, 0x07], 
        [0x2400, 0x07], [0x4800, 0x06], [0x01A0, 0x0B], 
        [0x02C0, 0x0A], [0x2600, 0x07], [0x0E00, 0x08], 
        [0x4C00, 0x06], [0x5000, 0x06], [0x2800, 0x07], 
        [0x00C0, 0x0C], [0x5400, 0x06], [0x2A00, 0x07], 
        [0x9800, 0x05], [0x0800, 0x09], [0x0880, 0x09], 
        [0x0F00, 0x08], [0x00D0, 0x0C], [0x0300, 0x0A], 
        [0x0900, 0x09], [0x0019, 0x10], [0x001A, 0x10], 
        [0x001B, 0x10], [0x001C, 0x10], [0x1000, 0x08], 
        [0x001D, 0x10], [0xA000, 0x05], [0x2C00, 0x07], 
        [0x5800, 0x06], [0x5C00, 0x06], [0xF000, 0x04], 
        [0x2E00, 0x07], [0x3000, 0x07], [0x6000, 0x06], 
        [0xA800, 0x05], [0x01C0, 0x0B], [0x1100, 0x08], 
        [0x6400, 0x06], [0x6800, 0x06], [0xB000, 0x05], 
        [0xB800, 0x05], [0xC000, 0x05], [0x01E0, 0x0B], 
        [0xC800, 0x05], [0xD000, 0x05], [0xD800, 0x05], 
        [0x3200, 0x07], [0x1200, 0x08], [0x6C00, 0x06], 
        [0x0980, 0x09], [0x1300, 0x08], [0x0340, 0x0A], 
        [0x00E0, 0x0C], [0x00F0, 0x0C], [0x0100, 0x0C], 
        [0x0110, 0x0C], [0x001E, 0x10], [0x001F, 0x10], 
        [0x0020, 0x10], [0x0021, 0x10], [0x0022, 0x10], 
        [0x0023, 0x10], [0x0024, 0x10], [0x0025, 0x10], 
        [0x0026, 0x10], [0x0027, 0x10], [0x0028, 0x10], 
        [0x0029, 0x10], [0x002A, 0x10], [0x002B, 0x10], 
        [0x002C, 0x10], [0x002D, 0x10], [0x002E, 0x10], 
        [0x002F, 0x10], [0x00A4, 0x0F], [0x00A6, 0x0F], 
        [0x00A8, 0x0F], [0x0030, 0x10], [0x0031, 0x10], 
        [0x0032, 0x10], [0x0033, 0x10], [0x0034, 0x10], 
        [0x0035, 0x10], [0x0036, 0x10], [0x0037, 0x10], 
        [0x0038, 0x10], [0x0039, 0x10], [0x003A, 0x10], 
        [0x003B, 0x10], [0x003C, 0x10], [0x003D, 0x10], 
        [0x003E, 0x10], [0x003F, 0x10], [0x0040, 0x10], 
        [0x0041, 0x10], [0x0042, 0x10], [0x0043, 0x10], 
        [0x0044, 0x10], [0x0045, 0x10], [0x0046, 0x10], 
        [0x0047, 0x10], [0x0048, 0x10], [0x0049, 0x10], 
        [0x004A, 0x10], [0x004B, 0x10], [0x004C, 0x10], 
        [0x004D, 0x10], [0x004E, 0x10], [0x004F, 0x10], 
        [0x0050, 0x10], [0x0051, 0x10], [0x0052, 0x10], 
        [0x0053, 0x10], [0x0054, 0x10], [0x0055, 0x10], 
        [0x0056, 0x10], [0x0057, 0x10], [0x0058, 0x10], 
        [0x0059, 0x10], [0x005A, 0x10], [0x005B, 0x10], 
        [0x005C, 0x10], [0x005D, 0x10], [0x005E, 0x10], 
        [0x005F, 0x10], [0x0060, 0x10], [0x0061, 0x10], 
        [0x0062, 0x10], [0x00AA, 0x0F], [0x0063, 0x10], 
        [0x0064, 0x10], [0x0065, 0x10], [0x0066, 0x10], 
        [0x0067, 0x10], [0x0068, 0x10], [0x0069, 0x10], 
        [0x006A, 0x10], [0x006B, 0x10], [0x006C, 0x10], 
        [0x006D, 0x10], [0x006E, 0x10], [0x006F, 0x10], 
        [0x0070, 0x10], [0x0071, 0x10], [0x0072, 0x10], 
        [0x0073, 0x10], [0x0074, 0x10], [0x0075, 0x10], 
        [0x0076, 0x10], [0x0077, 0x10], [0x0078, 0x10], 
        [0x0079, 0x10], [0x007A, 0x10], [0x007B, 0x10], 
        [0x007C, 0x10], [0x007D, 0x10], [0x007E, 0x10], 
        [0x007F, 0x10], [0x0080, 0x10], [0x0081, 0x10], 
        [0x0082, 0x10], [0x0083, 0x10], [0x0084, 0x10], 
        [0x0085, 0x10], [0x0086, 0x10], [0x0087, 0x10], 
        [0x0088, 0x10], [0x0089, 0x10], [0x008A, 0x10], 
        [0x008B, 0x10], [0x008C, 0x10], [0x008D, 0x10], 
        [0x00AC, 0x0F], [0x008E, 0x10], [0x008F, 0x10], 
        [0x0090, 0x10], [0x0091, 0x10], [0x0092, 0x10], 
        [0x0093, 0x10], [0x00AE, 0x0F], [0x0094, 0x10], 
        [0x0095, 0x10], [0x0096, 0x10], [0x0097, 0x10], 
        [0x0098, 0x10], [0x0099, 0x10] 
    ];

    matchEncode = [
        [0x80000000, 0x01], [0x80000000, 0x03], 
        [0xA0000000, 0x03], [0xC0000000, 0x03], 
        [0xE0000000, 0x06], [0xE4000000, 0x06], 
        [0xE8000000, 0x06], [0xEC000000, 0x06], 
        [0xF0000000, 0x06], [0xF4000000, 0x06], 
        [0xF8000000, 0x06], [0xFC000000, 0x0B], 
        [0xFC200000, 0x0B], [0xFC400000, 0x0B], 
        [0xFC600000, 0x0B], [0xFC800000, 0x0B], 
        [0xFCA00000, 0x0B], [0xFCC00000, 0x0B], 
        [0xFCE00000, 0x0B], [0xFD000000, 0x0B], 
        [0xFD200000, 0x0B], [0xFD400000, 0x0B], 
        [0xFD600000, 0x0B], [0xFD800000, 0x0B], 
        [0xFDA00000, 0x0B], [0xFDC00000, 0x0B], 
        [0xFDE00000, 0x0B], [0xFE000000, 0x0B], 
        [0xFE200000, 0x0B], [0xFE400000, 0x0B], 
        [0xFE600000, 0x0B], [0xFE800000, 0x0B], 
        [0xFEA00000, 0x0B], [0xFEC00000, 0x0B], 
        [0xFEE00000, 0x0B], [0xFF000000, 0x0B], 
        [0xFF200000, 0x0B], [0xFF400000, 0x0B], 
        [0xFF600000, 0x0B], [0xFF800000, 0x0B], 
        [0xFFA00000, 0x0B], [0xFFC00000, 0x0B], 
        [0xFFE00000, 0x13], [0xFFE02000, 0x13], 
        [0xFFE04000, 0x13], [0xFFE06000, 0x13], 
        [0xFFE08000, 0x13], [0xFFE0A000, 0x13], 
        [0xFFE0C000, 0x13], [0xFFE0E000, 0x13], 
        [0xFFE10000, 0x13], [0xFFE12000, 0x13], 
        [0xFFE14000, 0x13], [0xFFE16000, 0x13], 
        [0xFFE18000, 0x13], [0xFFE1A000, 0x13], 
        [0xFFE1C000, 0x13], [0xFFE1E000, 0x13], 
        [0xFFE20000, 0x13], [0xFFE22000, 0x13], 
        [0xFFE24000, 0x13], [0xFFE26000, 0x13], 
        [0xFFE28000, 0x13], [0xFFE2A000, 0x13], 
        [0xFFE2C000, 0x13], [0xFFE2E000, 0x13], 
        [0xFFE30000, 0x13], [0xFFE32000, 0x13], 
        [0xFFE34000, 0x13], [0xFFE36000, 0x13], 
        [0xFFE38000, 0x13], [0xFFE3A000, 0x13], 
        [0xFFE3C000, 0x13], [0xFFE3E000, 0x13], 
        [0xFFE40000, 0x13], [0xFFE42000, 0x13], 
        [0xFFE44000, 0x13], [0xFFE46000, 0x13], 
        [0xFFE48000, 0x13], [0xFFE4A000, 0x13], 
        [0xFFE4C000, 0x13], [0xFFE4E000, 0x13], 
        [0xFFE50000, 0x13], [0xFFE52000, 0x13], 
        [0xFFE54000, 0x13], [0xFFE56000, 0x13], 
        [0xFFE58000, 0x13], [0xFFE5A000, 0x13], 
        [0xFFE5C000, 0x13], [0xFFE5E000, 0x13], 
        [0xFFE60000, 0x13], [0xFFE62000, 0x13], 
        [0xFFE64000, 0x13], [0xFFE66000, 0x13], 
        [0xFFE68000, 0x13], [0xFFE6A000, 0x13], 
        [0xFFE6C000, 0x13], [0xFFE6E000, 0x13], 
        [0xFFE70000, 0x13], [0xFFE72000, 0x13], 
        [0xFFE74000, 0x13], [0xFFE76000, 0x13], 
        [0xFFE78000, 0x13], [0xFFE7A000, 0x13], 
        [0xFFE7C000, 0x13], [0xFFE7E000, 0x13], 
        [0xFFE80000, 0x13], [0xFFE82000, 0x13], 
        [0xFFE84000, 0x13], [0xFFE86000, 0x13], 
        [0xFFE88000, 0x13], [0xFFE8A000, 0x13], 
        [0xFFE8C000, 0x13], [0xFFE8E000, 0x13], 
        [0xFFE90000, 0x13], [0xFFE92000, 0x13], 
        [0xFFE94000, 0x13], [0xFFE96000, 0x13], 
        [0xFFE98000, 0x13], [0xFFE9A000, 0x13], 
        [0xFFE9C000, 0x13], [0xFFE9E000, 0x13], 
        [0xFFEA0000, 0x13], [0xFFEA2000, 0x13], 
        [0xFFEA4000, 0x13], [0xFFEA6000, 0x13], 
        [0xFFEA8000, 0x13], [0xFFEAA000, 0x13], 
        [0xFFEAC000, 0x13], [0xFFEAE000, 0x13], 
        [0xFFEB0000, 0x13], [0xFFEB2000, 0x13], 
        [0xFFEB4000, 0x13], [0xFFEB6000, 0x13], 
        [0xFFEB8000, 0x13], [0xFFEBA000, 0x13], 
        [0xFFEBC000, 0x13], [0xFFEBE000, 0x13], 
        [0xFFEC0000, 0x13], [0xFFEC2000, 0x13], 
        [0xFFEC4000, 0x13], [0xFFEC6000, 0x13], 
        [0xFFEC8000, 0x13], [0xFFECA000, 0x13], 
        [0xFFECC000, 0x13], [0xFFECE000, 0x13], 
        [0xFFED0000, 0x13], [0xFFED2000, 0x13], 
        [0xFFED4000, 0x13], [0xFFED6000, 0x13], 
        [0xFFED8000, 0x13], [0xFFEDA000, 0x13], 
        [0xFFEDC000, 0x13], [0xFFEDE000, 0x13], 
        [0xFFEE0000, 0x13], [0xFFEE2000, 0x13], 
        [0xFFEE4000, 0x13], [0xFFEE6000, 0x13], 
        [0xFFEE8000, 0x13], [0xFFEEA000, 0x13], 
        [0xFFEEC000, 0x13], [0xFFEEE000, 0x13], 
        [0xFFEF0000, 0x13], [0xFFEF2000, 0x13], 
        [0xFFEF4000, 0x13], [0xFFEF6000, 0x13], 
        [0xFFEF8000, 0x13], [0xFFEFA000, 0x13], 
        [0xFFEFC000, 0x13], [0xFFEFE000, 0x13], 
        [0xFFF00000, 0x13], [0xFFF02000, 0x13], 
        [0xFFF04000, 0x13], [0xFFF06000, 0x13], 
        [0xFFF08000, 0x13], [0xFFF0A000, 0x13], 
        [0xFFF0C000, 0x13], [0xFFF0E000, 0x13], 
        [0xFFF10000, 0x13], [0xFFF12000, 0x13], 
        [0xFFF14000, 0x13], [0xFFF16000, 0x13], 
        [0xFFF18000, 0x13], [0xFFF1A000, 0x13], 
        [0xFFF1C000, 0x13], [0xFFF1E000, 0x13], 
        [0xFFF20000, 0x13], [0xFFF22000, 0x13], 
        [0xFFF24000, 0x13], [0xFFF26000, 0x13], 
        [0xFFF28000, 0x13], [0xFFF2A000, 0x13], 
        [0xFFF2C000, 0x13], [0xFFF2E000, 0x13], 
        [0xFFF30000, 0x13], [0xFFF32000, 0x13], 
        [0xFFF34000, 0x13], [0xFFF36000, 0x13], 
        [0xFFF38000, 0x13], [0xFFF3A000, 0x13], 
        [0xFFF3C000, 0x13], [0xFFF3E000, 0x13], 
        [0xFFF40000, 0x13], [0xFFF42000, 0x13], 
        [0xFFF44000, 0x13], [0xFFF46000, 0x13], 
        [0xFFF48000, 0x13], [0xFFF4A000, 0x13], 
        [0xFFF4C000, 0x13], [0xFFF4E000, 0x13], 
        [0xFFF50000, 0x13], [0xFFF52000, 0x13], 
        [0xFFF54000, 0x13], [0xFFF56000, 0x13], 
        [0xFFF58000, 0x13], [0xFFF5A000, 0x13], 
        [0xFFF5C000, 0x13], [0xFFF5E000, 0x13], 
        [0xFFF60000, 0x13], [0xFFF62000, 0x13], 
        [0xFFF64000, 0x13], [0xFFF66000, 0x13], 
        [0xFFF68000, 0x13], [0xFFF6A000, 0x13], 
        [0xFFF6C000, 0x13], [0xFFF6E000, 0x13], 
        [0xFFF70000, 0x13], [0xFFF72000, 0x13], 
        [0xFFF74000, 0x13], [0xFFF76000, 0x13], 
        [0xFFF78000, 0x13], [0xFFF7A000, 0x13], 
        [0xFFF7C000, 0x13], [0xFFF7E000, 0x13], 
        [0xFFF80000, 0x13], [0xFFF82000, 0x13], 
        [0xFFF84000, 0x13], [0xFFF86000, 0x13], 
        [0xFFF88000, 0x13], [0xFFF8A000, 0x13], 
        [0xFFF8C000, 0x13], [0xFFF8E000, 0x13], 
        [0xFFF90000, 0x13], [0xFFF92000, 0x13], 
        [0xFFF94000, 0x13], [0xFFF96000, 0x13], 
        [0xFFF98000, 0x13], [0xFFF9A000, 0x13], 
        [0xFFF9C000, 0x13], [0xFFF9E000, 0x13], 
        [0xFFFA0000, 0x13], [0xFFFA2000, 0x13], 
        [0xFFFA4000, 0x13], [0xFFFA6000, 0x13], 
        [0xFFFA8000, 0x13], [0xFFFAA000, 0x13], 
        [0xFFFAC000, 0x13], [0xFFFAE000, 0x13], 
        [0xFFFB0000, 0x13], [0xFFFB2000, 0x13], 
        [0xFFFB4000, 0x13], [0xFFFB6000, 0x13], 
        [0xFFFB8000, 0x13], [0xFFFBA000, 0x13], 
        [0xFFFBC000, 0x13], [0xFFFBE000, 0x13], 
        [0xFFFC0000, 0x13], [0xFFFC2000, 0x13], 
        [0xFFFC4000, 0x13], [0xFFFC6000, 0x13], 
        [0xFFFC8000, 0x13], [0xFFFCA000, 0x13], 
        [0xFFFCC000, 0x13], [0xFFFCE000, 0x13], 
        [0xFFFD0000, 0x13], [0xFFFD2000, 0x13], 
        [0xFFFD4000, 0x13], [0xFFFD6000, 0x13], 
        [0xFFFD8000, 0x13], [0xFFFDA000, 0x13], 
        [0xFFFDC000, 0x13], [0xFFFDE000, 0x13], 
        [0xFFFE0000, 0x13], [0xFFFE2000, 0x13], 
        [0xFFFE4000, 0x13], [0xFFFE6000, 0x13], 
        [0xFFFE8000, 0x13], [0xFFFEA000, 0x13], 
        [0xFFFEC000, 0x13], [0xFFFEE000, 0x13], 
        [0xFFFF0000, 0x13], [0xFFFF2000, 0x13], 
        [0xFFFF4000, 0x13], [0xFFFF6000, 0x13], 
        [0xFFFF8000, 0x13], [0xFFFFA000, 0x13], 
        [0xFFFFC000, 0x13], [0xFFFFE000, 0x13], 
        [0x00000000, 0x00], [0x00000000, 0x00] 
    ];

    /**
     * Initialize the Lzpf class.
     *
     * @returns {undefined}
     */
    constructor() {
        this.clear();
    }

    /**
     * Sets starting values for the compression algorithm.
     *
     * @returns {undefined}
     */
    clear() {
        this.current_length = 0;
        this.current_literal = 0;
        this.flag = 0xFFFF;
        this.working_data = 0;
        this.match_index = 0;
        this.type_index = 0;
        this.checksum = 0;
        this.ring_buffer.fill(0x00, 0, 0x2000)
        this.flag_table.fill(0xFFFF, 0, 0x1000);
        this.compressed_data = [];
    }

    /**
     * Appends a byte to the end of the compressed byte array.  Re-allocates as needed
     *
     * @param byte {Number} char code of the byte to be added.
     *
     * @returns {undefined}
     */
    AddByte(byte) {
        this.compressed_data.push(byte);
    }

    /**
     * Encodes a literal onto the compressed byte array.
     *
     * @param code_length {Number} bit length of the code
     * @param code {Number} code to be encoded
     *
     * @returns {undefined}
     */
    EncodeLiteral(code_length, code) {
        // Using >>> to stick with unsigned integers without making a mess with casting.

        this.current_literal |= code >>> (this.current_length & 0x1F);
        this.current_length += code_length;

        while (this.current_length > 7) {
            this.AddByte((this.current_literal >>> 0x18) & 0xFF);

            this.current_length -= 8;
            this.current_literal = (this.current_literal << 8) & 0xFFFFFFFF;
        }
    }

    /**
     * Starts a compression stream
     *
     * @returns {undefined} Lzpf compression data
     */
    Begin() {
        this.clear();
    }

    /**
     * Compress a block of data.  Used for streamed chunks.
     *
     * @param uncompressed_data {String} data to compress
     *
     * @returns {Buffer} Lzpf compression data
     */
    CompressBlock(uncompressed_data) {
        this.compressed_data = [];

        if (uncompressed_data.words) {
            uncompressed_data = new Buffer.from(wtvsec.wordArrayToUint8Array(uncompressed_data));
        } else if (!uncompressed_data.byteLength) {
            // otherwise if its not already a Buffer, convert it to one
            uncompressed_data = new Buffer.from(uncompressed_data);
        }

        var uncompressed_len = uncompressed_data.length;

        var i = 0;
        var flags_index = 0;
        while (i < uncompressed_len) {
            var code_length = -1;
            var code = -1;

            var byte = uncompressed_data.readUInt8(i);
            this.ring_buffer[i & 0x1FFF] = byte;

            if (this.match_index > 0) {
                if (byte != this.ring_buffer[this.flag] || this.match_index > 0x0127) {
                    code_length = this.matchEncode[this.match_index][1];
                    code = this.matchEncode[this.match_index][0];
                    this.match_index = 0;
                    this.type_index = 3;
                } else {
                    this.match_index = (this.match_index + 1) & 0x1FFF;
                    this.flag = (this.flag + 1) & 0x1FFF;
                    this.checksum = (this.checksum + byte) & 0xFFFF;
                    this.working_data = ((this.working_data * 0x0100) + byte) & 0xFFFFFFFF;
                    i++;
                }
            } else {
                this.flag = 0xFFFF;

                if (i >= 3) {
                    flags_index = (this.working_data >>> 0x0B ^ this.working_data) & 0x0FFF;
                    this.flag = this.flag_table[flags_index];
                    this.flag_table[flags_index] = i & 0x1FFF;
                } else {
                    this.type_index++;
                }

                if (this.flag == 0xFFFF) {
                    code_length = this.nomatchEncode[byte][1];
                    code = this.nomatchEncode[byte][0] << 0x10;
                } else if (byte == this.ring_buffer[this.flag]) {
                    this.match_index = 1;
                    this.flag = (this.flag + 1) & 0x1FFF;
                    this.type_index = 4;
                } else {
                    code_length = this.nomatchEncode[byte][1] + 1;
                    code = this.nomatchEncode[byte][0] << 0x0F;
                }

                this.checksum = (this.checksum + byte) & 0xFFFF;
                this.working_data = ((this.working_data * 0x0100) + byte) & 0xFFFFFFFF;
                i++;
            }

            if (code_length > 0) {
                this.EncodeLiteral(code_length, code);
            }
        }

        return Buffer.from(this.compressed_data);
    }

    /**
     * Ends a compression stream.
     *
     * @param type_index {Number} the end type used to finalize
     *
     * @returns {Buffer} Lzpf compression data
     */
    Finish() {
        var code_length = -1
        var code = -1

        if (this.type_index == 2) {
            this.EncodeLiteral(0x10, 0x00990000);
        } else if (this.type_index >= 3) {
            if (this.type_index == 4) {
                code_length = this.matchEncode[this.match_index][1];
                code = this.matchEncode[this.match_index][0];
                this.EncodeLiteral(code_length, code);
            }

            var flags_index = (this.working_data >>> 0x0B ^ this.working_data) & 0x0FFF;
            var flag = this.flag_table[flags_index];
            if (flag == 0xFFFF) {
                this.EncodeLiteral(0x10, 0x00990000);
            } else {
                this.EncodeLiteral(0x11, 0x004c8000);
            }
        }

        // Below is just metadata.  The compressed block is complete.

        // Encode checksum
        this.EncodeLiteral(0x08, (this.checksum << 0x10) & 0xFFFFFFFF);
        this.EncodeLiteral(0x08, (this.checksum << 0x18) & 0xFFFFFFFF);

        // End
        this.AddByte((this.current_literal >>> 0x18) & 0xFF);
        this.AddByte(0x20);
    }

    /**
     * Compress data using WebTV's Lzpf compression algorithm and adds the footer to the end.
     *
     * @param uncompressed_data {String} data to compress
     *
     * @returns {Buffer} Lzpf compression data
     */
    Compress(uncompressed_data) {
        this.Begin();
        this.CompressBlock(uncompressed_data)
        this.Finish();

        return Buffer.from(this.compressed_data);
    }
}

module.exports = WTVLzpf;