import 'dotenv/config';
import { Client } from 'pg';
const client = new Client({ connectionString: process.env.DATABASE_URL });
const data: Record<string, Record<string, string>> = {
  'Ace of Pentacles': {
    GENERAL: 'Một hạt giống của sự thịnh vượng vừa được gieo xuống; bạn đang đón nhận cơ hội mới cực kỳ tiềm năng về vật chất hoặc khởi đầu mang tính ổn định cao.',
    LOVE: 'Một mối quan hệ mang lại cảm giác an toàn, thực tế và có nền tảng vững chắc; thời điểm tuyệt vời để xây dựng mục tiêu chung dài hạn.',
    CAREER: 'Lời mời nhận việc, dự án mới đầy hứa hẹn hoặc khoản thưởng xứng đáng; cơ hội vàng để khẳng định giá trị bản thân.',
    FINANCE: 'Tin vui lớn về tài chính; khoản tiền bất ngờ, cơ hội đầu tư sinh lời. Nắm bắt ngay nhưng cần kế hoạch quản lý khôn ngoan.',
    HEALTH: 'Sức khỏe có chuyển biến tích cực; thời điểm lý tưởng để bắt đầu chế độ dinh dưỡng hoặc tập luyện mới.',
    GROWTH: 'Bài học lớn nhất là hiện thực hóa và trân trọng giá trị hữu hình; kiên nhẫn và kỷ luật là chìa khóa giàu có đích thực.',
    CREATIVE: 'Biến ý tưởng bay bổng thành sản phẩm hữu hình; khả năng craftsmanship (tay nghề) được phát huy tối đa.',
  },
  'Two of Pentacles': {
    GENERAL: 'Bạn đang phải "tung hứng" nhiều việc cùng lúc; đòi hỏi sự khéo léo, ưu tiên và linh hoạt cực cao để giữ mọi thứ không đổ vỡ.',
    LOVE: 'Mối quan hệ đòi hỏi cân bằng giữa tình cảm và áp lực thực tế; cần sắp xếp thời gian hợp lý để không bỏ rơi nhau.',
    CAREER: 'Đa nhiệm (multi-tasking) với khối lượng lớn; quản lý thời gian và phân bổ nguồn lực thông minh để tránh quá tải.',
    FINANCE: 'Tài chính đòi hỏi xoay xở và cân đối thu chi cẩn trọng; giai đoạn tạm thời, chỉ cần giữ tỉnh táo trong quyết định chi tiêu.',
    HEALTH: 'Chìa khóa là cân bằng giữa ăn uống, làm việc và nghỉ ngơi; yoga hoặc các bộ môn phối hợp nhịp nhàng rất phù hợp.',
    GROWTH: 'Bài học lớn nhất là thích nghi với biến động; tìm thấy sự bình ổn ngay trong tâm bão.',
    CREATIVE: 'Thử nghiệm kết hợp các phong cách và chất liệu khác nhau; sáng tạo nảy sinh từ kết nối những thứ không liên quan.',
  },
  'Four of Pentacles': {
    GENERAL: 'Bạn đang ưu tiên ổn định và bảo mật nhưng cảnh báo về việc quá "giữ khư khư"; quá cứng nhắc sẽ tự cô lập mình.',
    LOVE: 'Mối quan hệ an toàn nhưng có dấu hiệu kiểm soát hoặc chiếm hữu; nỗi sợ mất mát thay cho niềm tin.',
    CAREER: 'Vị trí ổn định nhưng ngại thay đổi; tốt để củng cố nhưng đừng để nỗi sợ khiến bạn bỏ lỡ cơ hội thăng tiến.',
    FINANCE: 'Tài chính vững chắc nhờ tiết kiệm; nhưng đừng trở nên keo kiệt, tiền cần được lưu thông để sinh lời.',
    HEALTH: 'Sức khỏe ổn định nhưng bám víu thói quen cũ; chú ý vấn đề ách tắc (tiêu hóa, tuần hoàn). Thả lỏng tinh thần.',
    GROWTH: 'Bài học lớn nhất là sự hào phóng và buông bỏ; giá trị bản thân không nằm ở tài sản vật chất.',
    CREATIVE: 'Sáng tạo bị kìm hãm bởi nỗi sợ bị đánh giá và sự rập khuôn; hãy phá vỡ quy tắc tự đặt ra.',
  },
  'Five of Pentacles': {
    GENERAL: 'Giai đoạn khó khăn, cảm thấy bị bỏ rơi hoặc thiếu hụt nguồn lực; sự giúp đỡ ở ngay gần bên, chỉ cần bạn dũng cảm gõ cửa.',
    LOVE: 'Mối quan hệ đối mặt áp lực thực tế nặng nề; hoặc bạn cùng đối phương "vượt khó" trong thiếu thốn.',
    CAREER: 'Bấp bênh trong công việc, nguy cơ mất việc hoặc không được coi trọng; tìm kiếm đồng minh và tư vấn từ bên ngoài.',
    FINANCE: 'Tài chính "chạm đáy"; cắt giảm chi phí không thiết yếu và đừng ngần ngại tìm trợ giúp tài chính.',
    HEALTH: 'Sức khỏe suy giảm do thiếu dinh dưỡng hoặc bỏ bê; đừng phớt lờ triệu chứng nhỏ nhất.',
    GROWTH: 'Bài học lớn nhất là sự khiêm nhường và dũng cảm thừa nhận mình cần giúp đỡ.',
    CREATIVE: 'Thiếu hụt ngân sách hoặc công cụ; tận dụng sự thiếu thốn để kích thích sáng tạo đột phá.',
  },
  'Six of Pentacles': {
    GENERAL: 'Sự cân bằng đã được thiết lập; bạn có thể chia sẻ nguồn lực hoặc nhận sự giúp đỡ đúng lúc. Trân trọng giá trị "cho đi và nhận lại".',
    LOVE: 'Mối quan hệ tương trợ và thấu hiểu; chú ý giữ cán cân quyền lực cân bằng, tránh phụ thuộc không lành mạnh.',
    CAREER: 'Nhận được hỗ trợ từ cấp trên hoặc mentor; cũng là lúc chia sẻ kinh nghiệm cho đồng nghiệp mới.',
    FINANCE: 'Tin vui về tiền bạc; nợ được hoàn trả hoặc nhận khoản hỗ trợ bất ngờ. Trích một phần làm từ thiện để duy trì năng lượng tích cực.',
    HEALTH: 'Sức khỏe cải thiện nhờ tìm đúng thầy đúng thuốc; sự bình an trong tâm trí cũng góp phần chữa lành.',
    GROWTH: 'Bài học lớn nhất là lòng biết ơn; mọi thành công đều có sự góp sức của cộng đồng.',
    CREATIVE: 'Thời điểm tìm kiếm nhà tài trợ hoặc cộng tác; sự hào phóng trong sáng tạo mang lại kết quả ngoài mong đợi.',
  },
  'Seven of Pentacles': {
    GENERAL: 'Dừng lại để quan sát và đánh giá sau thời gian dài nỗ lực; hạt giống đã nảy mầm nhưng chưa đến lúc gặt hái. Cần kiên nhẫn tuyệt đối.',
    LOVE: 'Mối quan hệ bước vào giai đoạn trầm lắng; cân nhắc xem đối phương có xứng đáng để tiếp tục đầu tư.',
    CAREER: 'Có tiến triển nhưng đòi hỏi bền bỉ; kiên trì với dự án hiện tại, sự tỉ mỉ sẽ được đền đáp.',
    FINANCE: 'Đầu tư dài hạn đang tích lũy giá trị; tránh rút vốn vội vàng, cho tiền thêm thời gian "sinh sôi".',
    HEALTH: 'Sức khỏe đòi hỏi chăm sóc kiên trì, không có lối tắt; duy trì thói quen tốt đều đặn.',
    GROWTH: 'Bài học lớn nhất là kiên định và tin vào quá trình phát triển tự nhiên; "dục tốc bất đạt".',
    CREATIVE: 'Giai đoạn "thai nghén" và hoàn thiện dần; chau chuốt chi tiết nhỏ nhất, để ý tưởng chín muồi tự nhiên.',
  },
  'Eight of Pentacles': {
    GENERAL: 'Tập trung cao độ để rèn luyện kỹ năng và hoàn thiện bản thân; "khổ luyện thành tài", không có lối tắt.',
    LOVE: 'Mối quan hệ đòi hỏi vun đắp từ hành động nhỏ nhặt hàng ngày; tập trung hoàn thiện chính mình.',
    CAREER: 'Tinh thần trách nhiệm và chuyên nghiệp; thời điểm lý tưởng để học kỹ năng mới hoặc tham gia đào tạo chuyên sâu.',
    FINANCE: 'Tài chính tăng trưởng ổn định nhờ chăm chỉ và kỷ luật; tiền đến từ sức lao động chân chính.',
    HEALTH: 'Sức khỏe duy trì tốt nhờ kỷ luật ăn uống và tập luyện hàng ngày; không có liều thuốc thần kỳ bằng thói quen tốt.',
    GROWTH: 'Bài học lớn nhất là kiên trì và đam mê với công việc; tìm niềm vui trong quá trình lao động.',
    CREATIVE: 'Thời điểm của sự tinh xảo và kỹ thuật điêu luyện; sáng tạo kết hợp tư duy nghệ thuật và đôi tay tài hoa.',
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
