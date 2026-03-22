import 'dotenv/config';
import { Client } from 'pg';
const client = new Client({ connectionString: process.env.DATABASE_URL });
const data: Record<string, Record<string, string>> = {
  'Ten of Swords': {
    GENERAL: 'Bạn đã chạm đến điểm thấp nhất; mọi chuyện không thể tồi tệ hơn được nữa. Đây là kết thúc tuyệt đối, đau đớn nhưng cần thiết để mở đường cho ánh bình minh mới.',
    LOVE: 'Mối quan hệ đã đi đến hồi kết không thể cứu vãn, thường đi kèm cảm giác bị phản bội; hãy chấp nhận đây là điểm dừng để không phải chịu đựng thêm.',
    CAREER: 'Thất bại lớn, mất việc hoặc sự sụp đổ của dự án tâm huyết; đừng cố bám trụ trong "đống đổ nát", hãy chuẩn bị cho hướng đi mới.',
    FINANCE: 'Tình hình tài chính báo động đỏ, có thể mất trắng hoặc phá sản; khi đã ở đáy vực, con đường duy nhất là đi lên.',
    HEALTH: 'Cơ thể kiệt sức hoàn toàn; cần nghỉ ngơi tuyệt đối và có thể cần can thiệp y tế chuyên sâu.',
    GROWTH: 'Bài học lớn nhất là chấp nhận nghịch cảnh và sức mạnh hồi sinh; khi mọi thứ mất đi, bạn thực sự tự do để trở thành phiên bản mới.',
    CREATIVE: 'Dự án có thể phải hủy bỏ hoàn toàn; dũng cảm xóa sạch và bắt đầu lại, ý tưởng vĩ đại nhất nảy sinh từ tro tàn.',
  },
  'Page of Swords': {
    GENERAL: 'Bạn đang tràn đầy năng lượng trí tuệ, sự tò mò và khao khát tìm hiểu sự thật; tin tức hoặc ý tưởng bất ngờ đang đến đòi hỏi sự tỉnh táo.',
    LOVE: 'Mối quan hệ đề cao kết nối trí tuệ và trò chuyện thẳng thắn; cẩn trọng với lời nói vô tình gây hiểu lầm.',
    CAREER: 'Giai đoạn học hỏi, nghiên cứu và thu thập dữ liệu; thể hiện sự sắc sảo nhưng chú ý thái độ.',
    FINANCE: 'Tin tức hoặc ý tưởng mới về quản lý tiền bạc; đọc kỹ điều khoản và đặt câu hỏi cho đến khi hiểu rõ.',
    HEALTH: 'Năng lượng thần kinh cao, dễ lo lắng do suy nghĩ quá nhiều; chú ý đường hô hấp.',
    GROWTH: 'Bài học lớn nhất là phát triển tư duy độc lập; sử dụng ngôn từ sắc bén nhưng cần sự chín chắn.',
    CREATIVE: 'Cảm hứng đến từ thử nghiệm khái niệm mới và phá cách; ý tưởng "nghịch ngợm" là tiền đề cho đột phá lớn.',
  },
  'Knight of Swords': {
    GENERAL: 'Bạn đang cực kỳ sung sức, sẵn sàng lao vào với tốc độ cao và sự tập trung tuyệt đối; thực hiện kế hoạch tham vọng bằng sự quyết đoán.',
    LOVE: 'Mối quan hệ tiến triển nhanh với trò chuyện thẳng thắn; cẩn thận sự nóng nảy hoặc quá rạch ròi có thể tổn thương đối phương.',
    CAREER: 'Nhạy bén giải quyết vấn đề và nắm bắt cơ hội cực tốt; kiểm soát cái tôi để tránh xung đột do thẳng tính quá mức.',
    FINANCE: 'Tài chính biến động nhanh; có khả năng đầu tư táo bạo nhưng cần kiểm tra rủi ro trước khi hành động.',
    HEALTH: 'Năng lượng dồi dào nhưng dễ căng thẳng thần kinh; đề phòng chấn thương do vội vàng và vấn đề huyết áp.',
    GROWTH: 'Bài học lớn nhất là kết hợp lòng dũng cảm và sự thấu đáo; bảo vệ quan điểm quyết liệt nhưng giữ tỉnh táo.',
    CREATIVE: 'Ý tưởng tuôn trào với tốc độ chóng mặt; giai đoạn thực thi mạnh mẽ bằng kỹ thuật sắc sảo và tư duy logic.',
  },
  'Queen of Swords': {
    GENERAL: 'Bạn đang ở trạng thái trí tuệ sắc bén và độc lập; gạt bỏ mơ hồ, đối diện sự thật và thiết lập ranh giới rõ ràng.',
    LOVE: 'Tình yêu đề cao sự tôn trọng, thẳng thắn và không gian riêng; chỉ mở lòng với người xứng tầm về trí tuệ.',
    CAREER: 'Phong thái lãnh đạo công tâm, quyết đoán và giao tiếp sắc sảo; tuyệt vời cho đàm phán, viết lách hoặc tư vấn chiến lược.',
    FINANCE: 'Tài chính được quản lý khoa học; rà soát hợp đồng, hóa đơn và cắt giảm chi phí không cần thiết.',
    HEALTH: 'Chú trọng sức khỏe tinh thần và hệ thần kinh; buông bỏ áp lực bằng sự tỉnh táo thay vì kìm nén.',
    GROWTH: 'Bài học lớn nhất là sức mạnh của sự độc lập; biến trải nghiệm xương máu thành sự khôn ngoan và bản lĩnh.',
    CREATIVE: 'Thời điểm tinh chỉnh và biên tập xuất sắc; sáng tạo mang tính cấu trúc cao, mạch lạc và thông điệp rõ ràng.',
  },
  'King of Swords': {
    GENERAL: 'Bạn đang làm chủ hoàn toàn về trí tuệ và lý trí; quyết định dựa trên sự công bằng, đạo đức và dữ liệu thực tế.',
    LOVE: 'Mối quan hệ đề cao trung thực và chuẩn mực đạo đức; là chỗ dựa lý trí vững chắc nhưng đừng quá khắt khe hay khô khan.',
    CAREER: 'Vai trò chuyên gia hoặc lãnh đạo chiến lược; tiếng nói có sức nặng, tuyệt vời cho xử lý pháp lý và ký kết hợp đồng.',
    FINANCE: 'Tài chính được kiểm soát chặt chẽ, đầu tư bài bản và logic; nên tham vấn chuyên gia tài chính hoặc luật sư.',
    HEALTH: 'Cái nhìn khoa học về sức khỏe; tuân thủ nghiêm ngặt phác đồ điều trị và chế độ sinh hoạt đã chứng minh hiệu quả.',
    GROWTH: 'Bài học lớn nhất là sự liêm chính; dùng trí tuệ để kiến tạo sự công bằng, không thỏa hiệp với điều sai trái.',
    CREATIVE: 'Vai trò người thầy hoặc biên tập viên bậc thầy; hệ thống hóa ý tưởng phức tạp thành cấu trúc logic hoàn hảo.',
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
