import 'dotenv/config';
import { Client } from 'pg';
const client = new Client({ connectionString: process.env.DATABASE_URL });
const data: Record<string, Record<string, string>> = {
  'Knight of Pentacles': {
    GENERAL: 'Bạn đang tiến bước chậm rãi nhưng cực kỳ chắc chắn; duy trì sự kiên trì, làm việc có phương pháp và hoàn thành mọi cam kết.',
    LOVE: 'Một mối quan hệ dựa trên tin cậy và cam kết lâu dài; có thể thiếu kịch tính nhưng là "bến đỗ" an toàn và ổn định nhất.',
    CAREER: 'Người "cày cuốc" thực thụ, hoàn thành công việc chất lượng cao nhờ sự cần mẫn; chứng minh năng lực qua hành động thực tế.',
    FINANCE: 'Tài chính tăng trưởng ổn định nhờ chi tiêu kỷ luật và đầu tư an toàn dài hạn; kế hoạch thực tế mang lại an tâm cho tương lai.',
    HEALTH: 'Sức khỏe bền bỉ nhờ duy trì thói quen tốt đều đặn; sự kỷ luật là "thần dược" giúp cơ thể dẻo dai.',
    GROWTH: 'Bài học lớn nhất là giá trị của kiên trì và tinh thần trách nhiệm; đi hết con đường đã chọn dù có gian nan.',
    CREATIVE: 'Hiện thực hóa ý tưởng bằng lao động miệt mài; sáng tạo mang tính thực dụng cao, biến phác thảo thành sản phẩm thực tế.',
  },
  'Queen of Pentacles': {
    GENERAL: 'Cân bằng tuyệt vời giữa thịnh vượng vật chất và bình an tâm hồn; chăm sóc bản thân và mọi người bằng sự thực tế và lòng trắc ẩn.',
    LOVE: 'Tình yêu đầy sự chăm sóc, nuôi dưỡng và ổn định; người bạn đời lý tưởng biết cách biến ngôi nhà thành tổ ấm bình yên.',
    CAREER: 'Chuyên nghiệp đi kèm tận tâm; "người giữ lửa" quan trọng, tuyệt vời cho quản lý, nhân sự hoặc dự án đòi hỏi nuôi dưỡng dài hạn.',
    FINANCE: 'Tài chính sung túc và được quản lý khôn ngoan; thời điểm đầu tư vào không gian sống và giá trị bền vững cho gia đình.',
    HEALTH: 'Chăm sóc cơ thể toàn diện qua dinh dưỡng lành mạnh và kết nối thiên nhiên; làm vườn hoặc nấu ăn ngon để tái tạo sức sống.',
    GROWTH: 'Bài học lớn nhất là sự hào phóng và tự chủ; làm giàu cả tiền bạc lẫn tâm hồn, giữ sự thực tế mà không mất trái tim ấm áp.',
    CREATIVE: 'Cảm hứng từ điều bình dị; tác phẩm ứng dụng cao, đẹp mắt và ấm cúng. "Nghệ thuật hóa" cuộc sống đời thường.',
  },
  'King of Pentacles': {
    GENERAL: 'Đỉnh cao thành công về vật chất và sự ổn định; lãnh đạo quyết đoán, tầm nhìn thực tế và quản trị xuất sắc. Thành công dựa trên kỷ luật và bản lĩnh.',
    LOVE: 'Tình yêu an tâm tuyệt đối và cam kết vững chắc; người bạn đời mẫu mực, luôn bảo vệ và chu cấp cho tổ ấm.',
    CAREER: 'Chuyên gia đầu ngành, nhà điều hành tài năng hoặc doanh nhân thành đạt; thời điểm mở rộng kinh doanh và ký kết hợp đồng lớn.',
    FINANCE: 'Tài chính cực kỳ vững mạnh và tự do; nhìn thấu cơ hội kinh doanh và bảo tồn tài sản khôn ngoan.',
    HEALTH: 'Sức khỏe dẻo dai và tràn đầy sinh lực; duy trì lối sống điều độ và hưởng thụ tiện nghi tốt nhất.',
    GROWTH: 'Bài học lớn nhất là sự hào phóng của người thành đạt; dùng sức ảnh hưởng và tài sản để kiến tạo giá trị cho cộng đồng.',
    CREATIVE: 'Dự án quy mô lớn và thực tiễn cao; kết nối ý tưởng sáng tạo với nguồn lực thực tế để tạo sản phẩm có sức ảnh hưởng.',
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
