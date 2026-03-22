import 'dotenv/config';
import { Client } from 'pg';
const client = new Client({ connectionString: process.env.DATABASE_URL });
const data: Record<string, Record<string, string>> = {
  'Nine of Cups': {
    GENERAL: 'Bạn đang ở trong giai đoạn cực kỳ viên mãn và hài lòng với những gì mình đang có; mọi nỗ lực trước đây đã mang lại kết quả như ý.',
    LOVE: 'Một giai đoạn hạnh phúc rực rỡ khi bạn cảm thấy hoàn toàn thỏa mãn với mối quan hệ hiện tại hoặc đơn giản là yêu đời dù đang độc thân.',
    CAREER: 'Bạn đạt được một cột mốc quan trọng hoặc hoàn thành một dự án với kết quả xuất sắc; sự tự tin và năng lực được khẳng định rõ rệt.',
    FINANCE: 'Tình hình tài chính đang ở mức dư dả và ổn định, cho phép bạn tự thưởng cho mình những trải nghiệm sống chất lượng.',
    HEALTH: 'Sức khỏe thể chất và tinh thần đều đang ở trạng thái rất tốt; lưu ý tránh ăn uống quá đà hoặc lười vận động.',
    GROWTH: 'Bài học lớn nhất là sự biết ơn và yêu thương chính bản thân mình; tìm thấy niềm vui tự thân bền vững.',
    CREATIVE: 'Đây là thời điểm thăng hoa của sự tự tin trong sáng tạo; bạn hoàn toàn hài lòng với những tác phẩm mình làm ra.',
  },
  'Ten of Cups': {
    GENERAL: 'Đạt đến sự viên mãn tuyệt đối trong mọi khía cạnh; mọi xung đột được hóa giải, nhường chỗ cho sự hòa hợp, bình yên và cảm giác thuộc về.',
    LOVE: 'Đây là lá bài của sự thấu hiểu đạt đến mức tâm giao, dẫn đến những cam kết bền vững nhất như hôn nhân, xây dựng tổ ấm.',
    CAREER: 'Bạn tìm thấy môi trường làm việc lý tưởng nơi mọi người hỗ trợ nhau như người thân; sự nghiệp phát triển ổn định.',
    FINANCE: 'Tài chính thịnh vượng và an toàn cho cả gia đình; bạn có đủ nguồn lực để chia sẻ và xây dựng nền tảng vật chất vững chắc.',
    HEALTH: 'Thể chất và tinh thần đạt trạng thái cân bằng nhờ môi trường sống lành mạnh và tràn đầy yêu thương.',
    GROWTH: 'Bài học lớn nhất là lòng biết ơn và giá trị của sự kết nối; hạnh phúc thực sự chỉ trọn vẹn khi được sẻ chia.',
    CREATIVE: 'Cảm hứng sáng tạo đến từ những giá trị gia đình, cội nguồn; tác phẩm mang thông điệp chữa lành và gắn kết.',
  },
  'Page of Cups': {
    GENERAL: 'Một thông điệp bất ngờ mang tính tích cực hoặc cơ hội mới liên quan đến cảm xúc đang đến; hãy giữ tâm trí cởi mở và sẵn sàng đón nhận.',
    LOVE: 'Một giai đoạn mới đầy sự lãng mạn và ngọt ngào đang chớm nở; có thể là một lời tỏ tình dễ thương hoặc bạn đang học cách yêu lại chính mình.',
    CAREER: 'Một ý tưởng sáng tạo mới mẻ hoặc dự án đầy cảm hứng đang nhen nhóm; đây là lúc để học hỏi và khám phá.',
    FINANCE: 'Tài chính có tín hiệu khởi sắc nhẹ nhàng, một khoản tiền thưởng nhỏ hoặc tin tốt về đầu tư.',
    HEALTH: 'Sức khỏe tinh thần đang được cải thiện nhờ sở thích mới; lắng nghe tín hiệu nhỏ nhất từ cơ thể.',
    GROWTH: 'Bài học lớn nhất là tin tưởng vào trực giác và sự nhạy cảm của bản thân.',
    CREATIVE: 'Đây là thời điểm của những ý tưởng sơ khai đầy tiềm năng; cứ để trí tưởng tượng bay bổng.',
  },
  'Knight of Cups': {
    GENERAL: 'Một lời mời, tin nhắn lãng mạn hoặc cơ hội mang tính nghệ thuật đang tiến về phía bạn; lắng nghe tiếng gọi của trái tim.',
    LOVE: 'Đại diện cho sự lãng mạn đỉnh cao; bạn hoặc đối phương đang chủ động bày tỏ tình cảm một cách tinh tế.',
    CAREER: 'Cơ hội tham gia dự án sáng tạo; dùng sự ngoại giao và lòng trắc ẩn để giải quyết vấn đề.',
    FINANCE: 'Tình hình tài chính ổn nhưng cẩn trọng với lời mời đầu tư quá "màu hồng"; kiểm chứng bằng con số thực tế.',
    HEALTH: 'Sức khỏe thể chất gắn chặt với tinh thần; tìm đến chữa lành bằng nghệ thuật, âm nhạc hoặc thiền định.',
    GROWTH: 'Bài học lớn nhất là biến lý tưởng thành hành động thực tế; theo đuổi ước mơ nhưng giữ sự chân thành.',
    CREATIVE: 'Cảm hứng thăng hoa mang đậm tính thẩm mỹ; tác phẩm có chiều sâu cảm xúc, chạm đến trái tim.',
  },
  'Queen of Cups': {
    GENERAL: 'Bạn đang ở trạng thái kết nối sâu sắc với thế giới nội tâm; sự nhạy cảm và lòng nhân ái là sức mạnh giúp bạn thấu hiểu mọi người.',
    LOVE: 'Mối quan hệ tràn ngập sự ấm áp, thấu cảm và chăm sóc; bạn là "bến đỗ" bình yên, luôn lắng nghe và xoa dịu mọi tổn thương.',
    CAREER: 'Bạn thể hiện trí tuệ cảm xúc (EQ) cao; đặc biệt thành công trong lĩnh vực tâm lý, nghệ thuật hoặc chăm sóc con người.',
    FINANCE: 'Tình hình tài chính ổn định nhờ quản lý dựa trên trực giác nhạy bén và thái độ không quá tham cầu.',
    HEALTH: 'Chú trọng chữa lành từ bên trong; thiền định, trị liệu tâm lý hoặc dành thời gian bên làn nước sẽ giúp hồi phục tốt.',
    GROWTH: 'Bài học lớn nhất là tin tưởng hoàn toàn vào trực giác; làm chủ dòng chảy cảm xúc để đạt bình an nội tại.',
    CREATIVE: 'Cảm hứng tuôn trào từ tầng sâu tâm hồn; tác phẩm mang tính biểu tượng, giàu hình ảnh, chạm đến cảm xúc thầm kín.',
  },
  'King of Cups': {
    GENERAL: 'Bạn đang ở trạng thái cân bằng hoàn hảo giữa lý trí và tình cảm; giữ được cái đầu lạnh trong khi trái tim vẫn đầy lòng trắc ẩn.',
    LOVE: 'Một tình yêu trưởng thành, sâu sắc và đầy bao dung; bạn là chỗ dựa tinh thần vững chãi nhất.',
    CAREER: 'Bạn thể hiện phong thái nhà lãnh đạo điềm đạm, xoa dịu xung đột; nhận được sự kính trọng tuyệt đối.',
    FINANCE: 'Tình hình tài chính ổn định nhờ quyết định sáng suốt, không bị chi phối bởi cảm hứng nhất thời.',
    HEALTH: 'Sức khỏe tinh thần ở trạng thái lý tưởng; sự điềm tĩnh giúp kiểm soát tốt stress.',
    GROWTH: 'Bài học lớn nhất là làm chủ hoàn toàn thế giới cảm xúc; biến lòng trắc ẩn thành sức mạnh dẫn dắt.',
    CREATIVE: 'Cảm hứng đạt đến độ chín muồi; tác phẩm đẹp về hình thức và mang thông điệp nhân văn sâu sắc.',
  },
  'Ace of Swords': {
    GENERAL: 'Một luồng tư tưởng mới hoặc sự thật vừa được hé lộ giúp bạn thoát khỏi sự mơ hồ; thời điểm minh mẫn tuyệt đối.',
    LOVE: 'Sự thẳng thắn và trung thực là chìa khóa; làm rõ hiểu lầm hoặc đưa ra quyết định dứt khoát dựa trên lý trí.',
    CAREER: 'Một ý tưởng đột phá hoặc khởi đầu mới đầy chiến lược; bạn có đủ sự tập trung và sắc bén.',
    FINANCE: 'Rà soát tài chính khách quan và logic nhất; tin vào con số thực tế thay vì cảm tính.',
    HEALTH: 'Tinh thần minh mẫn giúp kiểm soát tốt thói quen sinh hoạt; có thể tìm ra phương pháp điều trị chính xác.',
    GROWTH: 'Bài học về sức mạnh của sự thật và tư duy độc lập; rèn luyện sự công tâm và thấu thị.',
    CREATIVE: 'Khoảnh khắc "Eureka" đầy ấn tượng; ý tưởng sắc bén, độc đáo và có cấu trúc rõ ràng.',
  },
  'Two of Swords': {
    GENERAL: 'Bạn đang rơi vào thế tiến thoái lưỡng nan; đang cố nhắm mắt làm ngơ trước sự thật khó chấp nhận hoặc trì hoãn quyết định quan trọng.',
    LOVE: 'Mối quan hệ đang ở trạng thái "chiến tranh lạnh"; cả hai né tránh thảo luận vấn đề cốt lõi.',
    CAREER: 'Đứng giữa hai lựa chọn khó khăn; cần thu thập thêm thông tin khách quan thay vì trì hoãn.',
    FINANCE: 'Tình hình tài chính đình trệ do né tránh nhìn thẳng vào các bản báo cáo; hãy đối diện thực tế.',
    HEALTH: 'Cơ thể chịu áp lực từ cảm xúc bị đè nén; chú ý sức khỏe mắt và hệ thần kinh.',
    GROWTH: 'Bài học lớn nhất là dũng cảm đối diện sự thật; phá bỏ chiếc băng bịt mắt của chính mình.',
    CREATIVE: 'Sáng tạo bị nghẽn vì quá nhiều ý tưởng đối nghịch; chọn một hướng duy nhất và cam kết.',
  },
  'Three of Swords': {
    GENERAL: 'Bạn đang phải đối mặt với sự thật đau lòng hoặc mất mát; những ảo tưởng bị đập tan, buộc phải chấp nhận thực tế.',
    LOVE: 'Giai đoạn cực kỳ khó khăn với tổn thương, phản bội hoặc chia tay; nỗi đau là cần thiết để chấm dứt hy vọng hão huyền.',
    CAREER: 'Xung đột gay gắt, phê bình nặng nề hoặc thất bại đau đớn; coi đây là bài học đắt giá để bắt đầu lại.',
    FINANCE: 'Biến cố lớn gây mất mát tiền bạc; cẩn trọng với quyết định chung vốn, rủi ro tranh chấp cao.',
    HEALTH: 'Chú ý tim mạch, huyết áp; đừng kìm nén cảm xúc, hãy để bản thân được chia sẻ và giải tỏa.',
    GROWTH: 'Bài học lớn nhất là chấp nhận nỗi đau như phần của sự trưởng thành; vết thương hôm nay là sức mạnh ngày mai.',
    CREATIVE: 'Cảm hứng đến từ góc khuất u tối nhất; tác phẩm tự sự chân thực sẽ có sức công phá mạnh mẽ.',
  },
  'Four of Swords': {
    GENERAL: 'Đây là thời điểm để tạm dừng, nghỉ ngơi và hồi phục năng lượng; đôi khi "không làm gì cả" là hành động sáng suốt nhất.',
    LOVE: 'Mối quan hệ cần "khoảng lặng" để nhìn nhận lại cảm xúc; nếu độc thân, hãy chữa lành tổn thương cũ trước.',
    CAREER: 'Tạm gác kế hoạch tham vọng để tránh burnout; dùng giai đoạn này để quan sát và đánh giá lại chiến lược.',
    FINANCE: 'Tài chính ổn định nhưng không có chuyển biến; "án binh bất động" và rà soát lại chi tiêu.',
    HEALTH: 'Ưu tiên hàng đầu cho nghỉ ngơi và hồi phục; giấc ngủ, thiền định là nút "Pause" cần thiết.',
    GROWTH: 'Bài học lớn nhất là sức mạnh của sự tĩnh lặng; câu trả lời đến từ những phút giây tĩnh tâm nhất.',
    CREATIVE: 'Giai đoạn "ủ bệnh" của ý tưởng; cho phép tâm trí thả lỏng, đột phá đến khi ít mong cầu nhất.',
  },
  'Five of Swords': {
    GENERAL: 'Bạn có thể giành chiến thắng nhưng cái giá là sự rạn nứt trong các mối quan hệ; chiến thắng này có xứng đáng với những gì đã đánh đổi?',
    LOVE: 'Mối quan hệ bị đầu độc bởi cái tôi quá lớn; lời nói sắc mỏng gây tổn thương khó chữa lành.',
    CAREER: 'Môi trường làm việc độc hại với sự "đâm sau lưng" và cạnh tranh không lành mạnh; cẩn trọng với "chiến thắng ảo".',
    FINANCE: 'Cảnh báo rủi ro liên quan đến lừa dối hoặc quyết định "chơi xấu"; ưu tiên sự minh bạch.',
    HEALTH: 'Căng thẳng thần kinh từ đối đầu liên miên; đau đầu, mất ngủ, tiêu hóa kém do áp lực tâm lý.',
    GROWTH: 'Bài học lớn nhất là sự khiêm tốn; sức mạnh thực sự nằm ở sự bao dung chứ không phải hạ bệ người khác.',
    CREATIVE: 'Ý tưởng bị phản đối; lắng nghe khách quan để lọc ra phản hồi có giá trị thay vì phản kháng quyết liệt.',
  },
  'Six of Swords': {
    GENERAL: 'Bạn đang trong giai đoạn quá độ, rời bỏ khó khăn để hướng tới tương lai ổn định hơn; sự thay đổi cần thiết dù đượm buồn.',
    LOVE: 'Mối quan hệ đang bước vào giai đoạn chữa lành sau sóng gió; buông bỏ oán hận để hướng tới hòa hợp.',
    CAREER: 'Thay đổi môi trường làm việc; công việc bắt đầu đi vào quỹ đạo ổn định, đòi hỏi tư duy mạch lạc để thích nghi.',
    FINANCE: 'Tài chính đang dần thoát khỏi bế tắc; dòng tiền bắt đầu ổn định nhờ quản lý chi tiêu lý trí hơn.',
    HEALTH: 'Quá trình hồi phục có tiến triển tích cực; thay đổi không gian sống hoặc đi du lịch gần nguồn nước sẽ giúp tinh thần nhẹ nhàng.',
    GROWTH: 'Bài học lớn nhất là chấp nhận thay đổi và buông bỏ; đôi khi rời đi chính là cách tốt nhất để tiến xa.',
    CREATIVE: 'Giai đoạn tinh chỉnh và "làm mượt" ý tưởng; loại bỏ chi tiết thừa để tạo tổng thể hài hòa có chiều sâu.',
  },
  'Seven of Swords': {
    GENERAL: 'Bạn đang hành động đơn độc hoặc dùng chiến thuật không minh bạch; cảnh giác với sự lừa dối và tự hỏi liệu "đi đường tắt" có bền vững.',
    LOVE: 'Mối quan hệ thiếu tin tưởng hoặc có bí mật bị che giấu; cẩn trọng với đối tượng có biểu hiện không rõ ràng.',
    CAREER: 'Cảnh báo chính trị công sở và cạnh tranh không lành mạnh; bảo mật thông tin và tránh tham gia kế hoạch thiếu minh bạch.',
    FINANCE: 'Cực kỳ thận trọng với đầu tư mờ ám; kiểm tra kỹ điều khoản hợp đồng và đề phòng mất tài sản.',
    HEALTH: 'Bạn đang phớt lờ dấu hiệu cảnh báo của cơ thể; đối diện thực tế sức khỏe thay vì trì hoãn.',
    GROWTH: 'Bài học lớn nhất là sự liêm chính; sự khôn lanh nhất thời không thể thay thế sự thật và tự trọng.',
    CREATIVE: 'Ý tưởng phá cách nhưng cẩn thận ranh giới giữa lấy cảm hứng và sao chép; cần đạo đức nghề nghiệp vững chắc.',
  },
  'Eight of Swords': {
    GENERAL: 'Bạn cảm thấy bị mắc kẹt và bế tắc nhưng thực tế những sợi dây trói lỏng hơn bạn nghĩ; bạn đang tự giới hạn bản thân bằng nỗi sợ.',
    LOVE: 'Mối quan hệ ngột ngạt; sự thiếu quyết đoán và nỗi sợ cô độc đang giữ chân bạn trong tình cảm không hạnh phúc.',
    CAREER: 'Cảm thấy bị bó buộc bởi môi trường độc hại; thực tế bạn có nhiều kỹ năng và cơ hội hơn bạn tưởng.',
    FINANCE: 'Cảm giác túng quẫn nhưng thực tế không bi đát như tưởng tượng; bình tĩnh liệt kê từng vấn đề.',
    HEALTH: 'Sức khỏe tinh thần bị ảnh hưởng bởi lo âu hoặc trầm cảm; cần tìm kiếm sự giúp đỡ từ chuyên gia.',
    GROWTH: 'Bài học lớn nhất là tự nhận thức và trách nhiệm với tự do cá nhân; ngừng đóng vai nạn nhân.',
    CREATIVE: 'Sáng tạo bị kìm hãm bởi sự tự phê phán quá mức; tháo bỏ "chiếc băng bịt mắt" để thấy khả năng thực sự.',
  },
  'Nine of Swords': {
    GENERAL: 'Bạn đang trải qua căng thẳng cực độ, lo âu và mất ngủ; phần lớn nỗi sợ chỉ tồn tại trong tâm trí.',
    LOVE: 'Mối quan hệ bị bủa vây bởi nghi ngờ, mặc cảm tội lỗi; hãy mở lòng chia sẻ thay vì chịu đựng một mình.',
    CAREER: 'Áp lực công việc khiến hoảng loạn; chia nhỏ vấn đề và giải quyết từng chút thay vì lo lắng viển vông.',
    FINANCE: 'Quá lo âu về tiền bạc; thực tế có thể không bi đát như tưởng tượng. Tìm lời khuyên từ người có kinh nghiệm.',
    HEALTH: 'Cảnh báo mất ngủ kinh niên, trầm cảm; ưu tiên chăm sóc sức khỏe tâm thần và tìm lại giấc ngủ bình yên.',
    GROWTH: 'Bài học lớn nhất là làm chủ nỗi sợ; phân biệt giữa thực tế và kịch bản tồi tệ do trí não tự vẽ ra.',
    CREATIVE: 'Cảm hứng đến từ góc tối sâu thẳm nhất; chuyển hóa nỗi sợ thành tác phẩm có sức ám ảnh và chiều sâu tâm lý.',
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
