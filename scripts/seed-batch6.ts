import 'dotenv/config';
import { Client } from 'pg';
const client = new Client({ connectionString: process.env.DATABASE_URL });
const data: Record<string, Record<string, string>> = {
  'Nine of Pentacles': {
    GENERAL: 'Bạn đang bước vào giai đoạn hoàng kim của sự tự do và thịnh vượng; sống chậm lại và tận hưởng những gì đã dày công xây dựng.',
    LOVE: 'Một tình yêu dựa trên tôn trọng không gian riêng và giá trị cá nhân; người độc lập, quyến rũ và không cần dựa dẫm ai.',
    CAREER: 'Vị thế vững chắc, thăng tiến hoặc thành công rực rỡ trong kinh doanh riêng; uy tín được khẳng định tuyệt đối.',
    FINANCE: 'Tài chính dư dả, tự do tài chính ở mức nhất định; tiếp tục quản lý thông minh để duy trì thịnh vượng bền vững.',
    HEALTH: 'Sức khỏe thể chất và tinh thần lý tưởng; chăm sóc bản thân qua dinh dưỡng lành mạnh và gần gũi thiên nhiên.',
    GROWTH: 'Bài học lớn nhất là tự tin vào giá trị nội tại; trân trọng sự cô độc quý giá, hạnh phúc đến từ sự đủ đầy bên trong.',
    CREATIVE: 'Ý tưởng mang tính thẩm mỹ cao và hoàn thiện tuyệt đối; tập trung chất lượng, tạo ra "đứa con tinh thần" đẳng cấp.',
  },
  'Ten of Pentacles': {
    GENERAL: 'Viên mãn tột bậc về vật chất và tinh thần; tri ân cội nguồn và tận hưởng thành quả ổn định lâu dài. Mọi thứ là di sản cho tương lai.',
    LOVE: 'Cam kết sâu sắc nhất — hôn nhân, lập gia đình, xây dựng tổ ấm; sự ủng hộ từ gia đình và dòng tộc đóng vai trò quan trọng.',
    CAREER: 'Môi trường ổn định, có bề dày lịch sử; sự nghiệp đạt độ chín muồi. Lúc để truyền nghề và cố vấn cho thế hệ kế cận.',
    FINANCE: 'Tài chính cực kỳ vững mạnh — tài sản thừa kế, bất động sản, đầu tư dài hạn sinh lời lớn. Cân nhắc lập di chúc.',
    HEALTH: 'Sức khỏe ổn định nhờ lối sống lành mạnh; chú ý vấn đề sức khỏe truyền thống của dòng họ để phòng ngừa sớm.',
    GROWTH: 'Bài học lớn nhất là kết nối nguồn cội và trách nhiệm với di sản; bạn là mắt xích quan trọng trong dòng chảy thế hệ.',
    CREATIVE: 'Tác phẩm có giá trị vượt thời gian, mang đậm dấu ấn văn hóa; kết hợp kỹ thuật cổ điển và tư duy hiện đại.',
  },
  'Page of Pentacles': {
    GENERAL: 'Khởi đầu mới mang tính thực tế hoặc tin tốt lành về tiền bạc, công việc; đón nhận bằng sự tỉ mỉ và tinh thần sẵn sàng học hỏi.',
    LOVE: 'Tình cảm chớm nở, ổn định và chân thành; xây dựng nền tảng dựa trên tin tưởng và hành động thực tế.',
    CAREER: 'Cơ hội học tập, thực tập hoặc dự án mới đòi hỏi kiên nhẫn; sự chăm chỉ là bệ phóng cho thành công lớn.',
    FINANCE: 'Tín hiệu tích cực hoặc cơ hội đầu tư nhỏ nhưng tiềm năng; thời điểm lý tưởng để lập kế hoạch tiết kiệm.',
    HEALTH: 'Tín hiệu tốt để bắt đầu thói quen lành mạnh mới; kiên trì với thay đổi nhỏ, kết quả bền vững sẽ đến.',
    GROWTH: 'Bài học lớn nhất là hiện thực hóa ước mơ qua hành động cụ thể; kiên nhẫn biến lý thuyết thành thành tựu thực tiễn.',
    CREATIVE: 'Cảm hứng đến từ học hỏi kỹ năng mới hoặc thử nghiệm chất liệu thực tế; tỉ mỉ từ bước nhỏ nhất.',
  },
};
async function run() {
  await client.connect();
  for (const [name, meanings] of Object.entries(data)) {
    const r = await client.query('SELECT card_id FROM "Card" WHERE name = $1', [name]);
    if (r.rows.length === 0) { console.error('❌ Not found: ' + name); continue; }
    const cid = r.rows[0].card_id;
    for (const [cat, content] of Object.entries(meanings)) {
      await client.query('INSERT INTO "CardMeaning" (card_id, category, content) VALUES ($1,$2,$3)', [cid, cat, content]);
    }
    console.log('✅ ' + name + ' (card_id=' + cid + ')');
  }
  const res = await client.query('SELECT COUNT(*) FROM "CardMeaning"');
  console.log('\n📖 Total: ' + res.rows[0].count);
  await client.end();
}
run().catch(e => { console.error(e); process.exit(1); });
