import 'dotenv/config';
import { Client } from 'pg';
const c = new Client({ connectionString: process.env.DATABASE_URL });
const data: Record<string, string> = {
  GENERAL: 'Đây là thời điểm của sự hợp tác có kế hoạch và triển khai các kỹ năng chuyên môn; bạn đang nhận được sự công nhận cho những nỗ lực và tài năng của mình.',
  LOVE: 'Mối quan hệ được xây dựng dựa trên sự tôn trọng lẫn nhau và tinh thần sẵn sàng cùng nhau xây tổ ấm.',
  CAREER: 'Lá bài tuyệt vời nhất cho sự nghiệp; đại diện cho sự chuyên nghiệp, kỹ năng xuất sắc và khả năng làm việc nhóm hiệu quả.',
  FINANCE: 'Tài chính tăng trưởng nhờ áp dụng kiến thức chuyên môn hoặc lời khuyên đầu tư đúng đắn từ chuyên gia.',
  HEALTH: 'Đi đúng hướng trong chăm sóc cơ thể nhờ kỷ luật và kiến thức chuyên môn; phối hợp các phương pháp điều trị.',
  GROWTH: 'Bài học lớn nhất là giá trị của sự học hỏi và sức mạnh tập thể; thành tựu vĩ đại luôn cần sự chung tay.',
  CREATIVE: 'Giai đoạn thực thi kỹ thuật đỉnh cao; sáng tạo mang tính cộng hưởng, mỗi chi tiết đóng góp vào vẻ đẹp tổng thể.',
};
async function run() {
  await c.connect();
  const r = await c.query('SELECT card_id FROM "Card" WHERE name = $1', ['Three of Pentacles']);
  const cid = r.rows[0].card_id;
  for (const [cat, content] of Object.entries(data)) {
    await c.query('INSERT INTO "CardMeaning" (card_id, category, content) VALUES ($1,$2,$3)', [cid, cat, content]);
  }
  console.log('✅ Three of Pentacles (card_id=' + cid + ')');
  const res = await c.query('SELECT COUNT(*) FROM "CardMeaning"');
  console.log('📖 Total: ' + res.rows[0].count);
  await c.end();
}
run().catch(e => { console.error(e); process.exit(1); });
