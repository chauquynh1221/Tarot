import 'dotenv/config';
import { Client } from 'pg';
const c = new Client({ connectionString: process.env.DATABASE_URL });
const data: Record<string, Record<string, string>> = {
  'Three of Pentacles': {
    GENERAL: 'Đây là thời điểm của sự hợp tác có kế hoạch và triển khai các kỹ năng chuyên môn; bạn đang nhận được sự công nhận cho những nỗ lực và tài năng của mình.',
    LOVE: 'Mối quan hệ được xây dựng dựa trên sự tôn trọng lẫn nhau và tinh thần sẵn sàng cùng nhau xây tổ ấm.',
    CAREER: 'Lá bài tuyệt vời nhất cho sự nghiệp; đại diện cho sự chuyên nghiệp, kỹ năng xuất sắc và khả năng làm việc nhóm hiệu quả.',
    FINANCE: 'Tài chính tăng trưởng nhờ áp dụng kiến thức chuyên môn hoặc lời khuyên đầu tư đúng đắn từ chuyên gia.',
    HEALTH: 'Đi đúng hướng trong chăm sóc cơ thể nhờ kỷ luật và kiến thức chuyên môn; phối hợp các phương pháp điều trị.',
    GROWTH: 'Bài học lớn nhất là giá trị của sự học hỏi và sức mạnh tập thể; thành tựu vĩ đại luôn cần sự chung tay.',
    CREATIVE: 'Giai đoạn thực thi kỹ thuật đỉnh cao; sáng tạo mang tính cộng hưởng, mỗi chi tiết đóng góp vào vẻ đẹp tổng thể.',
  },
  'Five of Wands': {
    GENERAL: 'Bạn đang ở trong môi trường đầy xáo trộn, cạnh tranh và ý kiến trái chiều; đây là sự va chạm cần thiết để tìm ra giải pháp tốt nhất.',
    LOVE: 'Mối quan hệ đang trải qua những cuộc tranh cãi vặt vãnh hoặc bất đồng quan điểm; cả hai đều muốn khẳng định cái tôi thay vì lắng nghe.',
    CAREER: 'Cạnh tranh khốc liệt tại nơi làm việc; rèn luyện bản lĩnh và khả năng làm việc dưới áp lực, sự cọ xát giúp ý tưởng sắc bén hơn.',
    FINANCE: 'Tài chính biến động do chi phí phát sinh hoặc cạnh tranh trong đầu tư; cẩn trọng với quyết định bốc đồng.',
    HEALTH: 'Cơ thể quá tải do stress; chú ý vết thương nhẹ do va chạm hoặc căng cơ. Thiền định giúp lấy lại cân bằng.',
    GROWTH: 'Bài học lớn nhất là quản lý xung đột và tôn trọng quan điểm khác biệt; sự đa dạng là chất xúc tác để vượt qua giới hạn.',
    CREATIVE: 'Giai đoạn bùng nổ ý tưởng từ mâu thuẫn; sáng tạo nảy sinh từ thử sai, phản biện và phá vỡ khuôn mẫu.',
  },
  'Page of Wands': {
    GENERAL: 'Một làn sóng năng lượng mới, ý tưởng đầy cảm hứng hoặc thông điệp thúc đẩy bạn hành động; đón nhận sự thay đổi với tâm thế hào hứng.',
    LOVE: 'Mối quan hệ tươi mới, nhiều phiêu lưu thú vị và kết nối tràn đầy năng lượng; thời điểm tuyệt vời cho hẹn hò trải nghiệm mới lạ.',
    CAREER: 'Dự án mới hoặc hướng đi đầy triển vọng đang mở ra; sự sáng tạo và khả năng thích nghi nhanh là chìa khóa.',
    FINANCE: 'Tin tức tích cực hoặc cơ hội đầu tư nhỏ nhưng tiềm năng; giữ cái đầu tỉnh táo, đừng bị cuốn vào lời hứa hẹn hào nhoáng.',
    HEALTH: 'Năng lượng thể chất dồi dào và tinh thần lạc quan; lý tưởng để bắt đầu bộ môn thể thao mới.',
    GROWTH: 'Bài học lớn nhất là lòng can đảm để bắt đầu; nuôi dưỡng đam mê sơ khai thành động lực phát triển dài hạn.',
    CREATIVE: 'Bùng nổ ý tưởng "thô" nhưng đầy sức sống; đừng quá chú trọng sự hoàn hảo, để dòng chảy sáng tạo tuôn trào tự nhiên.',
  },
};
async function run() {
  await c.connect();
  for (const [name, meanings] of Object.entries(data)) {
    const r = await c.query('SELECT card_id FROM "Card" WHERE name = $1', [name]);
    if (r.rows.length === 0) { console.error('❌ Not found: ' + name); continue; }
    const cid = r.rows[0].card_id;
    for (const [cat, content] of Object.entries(meanings)) {
      await c.query('INSERT INTO "CardMeaning" (card_id, category, content) VALUES ($1,$2,$3)', [cid, cat, content]);
    }
    console.log('✅ ' + name + ' (card_id=' + cid + ')');
  }
  const res = await c.query('SELECT COUNT(*) FROM "CardMeaning"');
  console.log('\n📖 Total: ' + res.rows[0].count);
  await c.end();
}
run().catch(e => { console.error(e); process.exit(1); });
