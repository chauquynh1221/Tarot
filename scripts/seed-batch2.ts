import 'dotenv/config';
import { Client } from 'pg';
const client = new Client({ connectionString: process.env.DATABASE_URL });
const data: Record<string, Record<string, string>> = {
  'Ten of Wands': {
    GENERAL: 'Bạn đang ôm đồm quá nhiều việc cùng một lúc và cảm thấy kiệt sức; mặc dù thành công đã ở rất gần nhưng gánh nặng trách nhiệm đang đè bẹp sự hào hứng và khiến bạn không còn thời gian cho bản thân.',
    LOVE: 'Mối quan hệ đang trở nên nặng nề vì một mình bạn đang cố gắng gánh vác mọi trách nhiệm hoặc giải quyết mọi mâu thuẫn; sự thiếu sẻ chia và tương tác công bằng đang khiến tình yêu dần trở thành một nghĩa vụ mệt mỏi.',
    CAREER: 'Bạn đang bị quá tải bởi khối lượng công việc khổng lồ, những deadline dồn dập và kỳ vọng quá cao từ cấp trên; đây là lúc bắt buộc phải học cách ủy quyền, từ chối bớt nhiệm vụ hoặc tìm kiếm sự trợ giúp thay vì cố gắng tự mình làm hết mọi thứ.',
    FINANCE: 'Áp lực tiền bạc đang đè nặng lên vai, có thể do các khoản nợ, chi phí sinh hoạt tăng cao hoặc gánh nặng chu cấp cho người khác; bạn cần tái cơ cấu lại ngân sách và ưu tiên những khoản chi thiết yếu.',
    HEALTH: 'Cơ thể đang báo động đỏ vì sự làm việc quá sức và căng thẳng kéo dài; hãy đặc biệt chú ý đến các vấn đề về cột sống, vai gáy và tình trạng mất ngủ.',
    GROWTH: 'Bài học lớn nhất là việc học cách nói "Không" và thiết lập ranh giới cá nhân; bạn đang học cách phân biệt đâu là trách nhiệm thực sự của mình và đâu là những gánh nặng không cần thiết.',
    CREATIVE: 'Sự sáng tạo đang bị bóp nghẹt bởi áp lực phải hoàn hảo; hãy tạm dừng, chia nhỏ khối lượng công việc và tìm lại niềm vui thuần túy ban đầu.',
  },
  'Knight of Wands': {
    GENERAL: 'Bạn đang tràn đầy năng lượng và sẵn sàng hành động ngay lập tức; đây là thời điểm của những thay đổi đột ngột, những chuyến đi bất ngờ hoặc những quyết định mang tính bộc phát nhưng đầy nhiệt huyết.',
    LOVE: 'Một tình yêu nồng cháy, cuồng nhiệt và đầy kịch tính đang đến; tuy nhiên, hãy cẩn thận vì sự hưng phấn này có thể chỉ mang tính nhất thời.',
    CAREER: 'Bạn đang tiến lên với sự tự tin tuyệt đối và tốc độ nhanh; đây là lúc để thực hiện những bước đi táo bạo, thay đổi môi trường làm việc hoặc dấn thân vào những thử thách mới.',
    FINANCE: 'Tài chính có sự chuyển động nhanh, tiền có thể đến từ những quyết định quyết đoán nhưng cũng dễ dàng "bay hơi" vì những khoản chi tiêu mang tính ngẫu hứng.',
    HEALTH: 'Năng lượng thể chất dồi dào khiến bạn cảm thấy bứt rứt nếu không được vận động; hãy chú ý đến các chấn thương do vội vàng.',
    GROWTH: 'Bài học lớn nhất là cách kiểm soát ngọn lửa đam mê bên trong; bạn đang học cách biến sự hăng máu nhất thời thành sức mạnh hành động bền vững.',
    CREATIVE: 'Cảm hứng sáng tạo đang ở mức cực kỳ mãnh liệt và đòi hỏi phải được giải phóng ngay; phong cách nghệ thuật mang tính bứt phá và táo bạo.',
  },
  'Queen of Wands': {
    GENERAL: 'Bạn đang tỏa sáng với sự tự tin, lạc quan và sức hút mãnh liệt; đây là lúc bạn hoàn toàn làm chủ tình thế bằng bản lĩnh và sự quyết đoán của mình.',
    LOVE: 'Một tình yêu tràn đầy đam mê, sự chủ động và trung thực; bạn đang thể hiện hình ảnh một người tình quyến rũ, độc lập và luôn biết cách giữ cho ngọn lửa tình cảm rực cháy.',
    CAREER: 'Bạn đang thể hiện phong thái của một nhà lãnh đạo tự tin, có khả năng truyền cảm hứng và quản lý nhiều đầu việc cùng lúc một cách hiệu quả.',
    FINANCE: 'Tình hình tài chính đang rất khả quan nhờ sự quyết đoán và khả năng quản lý dòng tiền thông minh.',
    HEALTH: 'Bạn đang ở trạng thái năng lượng dồi dào, tâm thế vui vẻ và sức sống mãnh liệt.',
    GROWTH: 'Bài học lớn nhất là sự khẳng định giá trị bản thân và sống thật với cá tính của mình.',
    CREATIVE: 'Cảm hứng sáng tạo bùng nổ dựa trên sự tự tin và phong cách cá nhân đậm nét.',
  },
  'King of Wands': {
    GENERAL: 'Bạn đang ở vị thế của một người làm chủ cuộc chơi với tầm nhìn chiến lược và sự tự tin tuyệt đối; đây là lúc để thực hiện những kế hoạch lớn lao bằng bản lĩnh và kinh nghiệm dày dạn.',
    LOVE: 'Một tình yêu đầy sự bảo bọc, chân thành và có định hướng rõ ràng cho tương lai; bạn đang đóng vai trò là trụ cột tinh thần vững chắc.',
    CAREER: 'Bạn thể hiện tố chất của một nhà lãnh đạo thực thụ hoặc một doanh nhân dám nghĩ dám làm; đây là thời điểm vàng để khởi nghiệp hoặc mở rộng quy mô.',
    FINANCE: 'Tình hình tài chính vững mạnh nhờ những quyết định đầu tư thông minh và tầm nhìn dài hạn.',
    HEALTH: 'Sức khỏe thể chất cực kỳ tốt với nguồn năng lượng bền bỉ; tuy nhiên cần kiểm soát sự nóng nảy và áp lực từ công việc.',
    GROWTH: 'Bài học lớn nhất là sự làm chủ bản thân và trách nhiệm với cộng đồng.',
    CREATIVE: 'Đây là lúc bạn biến những ý tưởng sáng tạo thành một "đế chế" hoặc một tác phẩm để đời.',
  },
  'Ace of Cups': {
    GENERAL: 'Một làn sóng cảm xúc mới mẻ đang tràn ngập tâm hồn bạn; đây là khởi đầu của tình yêu, lòng trắc ẩn hoặc một sự kết nối tâm linh sâu sắc mang lại niềm vui thuần khiết.',
    LOVE: 'Một tình yêu mới đầy hứa hẹn hoặc sự tái sinh của tình cảm cũ; trái tim bạn đang mở toang để đón nhận những cảm xúc chân thành và ngọt ngào nhất.',
    CAREER: 'Một dự án mới mang lại sự thỏa mãn về mặt cảm xúc; bạn tìm thấy niềm đam mê thực sự trong công việc.',
    FINANCE: 'Tài chính ổn định theo hướng nhẹ nhàng; tiền đến từ những nguồn mang tính chia sẻ và yêu thương.',
    HEALTH: 'Sức khỏe tinh thần được cải thiện rõ rệt nhờ những mối quan hệ tích cực; cơ thể được nuôi dưỡng bởi niềm vui.',
    GROWTH: 'Bài học về sự mở lòng và đón nhận; bạn đang học cách yêu thương không điều kiện.',
    CREATIVE: 'Cảm hứng tuôn trào từ trái tim; tác phẩm mang đậm tính cảm xúc và chạm đến tâm hồn người xem.',
  },
  'Two of Cups': {
    GENERAL: 'Đây là thời điểm tuyệt vời cho các mối quan hệ và sự hợp tác; bạn sẽ tìm thấy sự đồng điệu, thấu hiểu và hỗ trợ lẫn nhau trong mọi khía cạnh của cuộc sống.',
    LOVE: 'Một lá bài cực kỳ tốt cho tình cảm, đại diện cho sự gắn kết sâu sắc, thu hút lẫn nhau và sự cân bằng giữa cho và nhận.',
    CAREER: 'Một sự hợp tác kinh doanh thành công hoặc một mối quan hệ đồng nghiệp thân thiết đang hình thành.',
    FINANCE: 'Tình hình tài chính có sự ổn định nhờ vào các thỏa thuận công bằng hoặc sự hỗ trợ từ đối tác.',
    HEALTH: 'Sức khỏe tinh thần và thể chất đang ở trạng thái cân bằng; tìm kiếm người đồng hành giúp hồi phục tốt hơn.',
    GROWTH: 'Bài học lớn nhất là sự học cách mở lòng và xây dựng niềm tin với người khác.',
    CREATIVE: 'Đây là thời điểm lý tưởng cho những dự án mang tính cộng tác hoặc tìm kiếm một cộng sự ăn ý.',
  },
  'Three of Cups': {
    GENERAL: 'Niềm vui, sự ăn mừng và tình bạn đang tỏa sáng; đây là lúc để tận hưởng những khoảnh khắc vui vẻ bên bạn bè và gia đình.',
    LOVE: 'Tình yêu được bao bọc bởi sự ủng hộ của bạn bè và cộng đồng; nếu độc thân, bạn có thể gặp được người đặc biệt qua các buổi tiệc hoặc sự kiện xã hội.',
    CAREER: 'Thành công đến từ sự hợp tác nhóm hiệu quả; đây là lúc để ăn mừng những thành quả chung và thắt chặt tình đồng đội.',
    FINANCE: 'Tiền bạc dư dả cho những buổi tiệc tùng và hoạt động xã hội; chi tiêu hợp lý cho niềm vui cũng là cách đầu tư cho các mối quan hệ.',
    HEALTH: 'Tinh thần sảng khoái nhờ sự kết nối xã hội; niềm vui và tiếng cười là liều thuốc tốt nhất cho sức khỏe.',
    GROWTH: 'Bài học về giá trị của tình bạn và cộng đồng; sự chia sẻ niềm vui nhân đôi hạnh phúc.',
    CREATIVE: 'Cảm hứng đến từ sự giao lưu và hợp tác; những ý tưởng nảy sinh từ cuộc trò chuyện vui vẻ.',
  },
  'Four of Cups': {
    GENERAL: 'Bạn đang rơi vào trạng thái thờ ơ, mất cảm hứng hoặc quá tập trung vào những gì mình không có mà bỏ qua những cơ hội tốt đang hiện hữu ngay trước mắt.',
    LOVE: 'Mối quan hệ đang trở nên nhạt nhẽo hoặc bạn đang cảm thấy không hài lòng với những gì mình có; có lẽ bạn đang quá kén chọn hoặc đóng cửa trái tim.',
    CAREER: 'Cảm giác thiếu động lực và chán nản với công việc hiện tại; bạn có xu hướng từ chối các đề nghị hoặc cơ hội mới.',
    FINANCE: 'Tình hình tài chính dậm chân tại chỗ do sự thiếu quan tâm hoặc quá thận trọng.',
    HEALTH: 'Cơ thể đang ở trạng thái uể oải, thiếu sức sống do mệt mỏi về tinh thần.',
    GROWTH: 'Bài học lớn nhất là học cách trân trọng hiện tại và mở lòng với những khả năng mới.',
    CREATIVE: 'Sự sáng tạo đang gặp bế tắc; hãy thử nhìn nhận đề tài dưới một lăng kính hoàn toàn khác.',
  },
  'Five of Cups': {
    GENERAL: 'Bạn đang quá tập trung vào những mất mát và thất bại mà quên mất rằng mình vẫn còn những nguồn lực quý giá khác; hãy quay người lại để thấy những cơ hội đang chờ đợi.',
    LOVE: 'Mối quan hệ đang trải qua giai đoạn đau buồn; tuy nhiên, tình yêu vẫn chưa hoàn toàn biến mất, quan trọng là bạn có đủ can đảm để nhìn nhận những gì còn lại.',
    CAREER: 'Một dự án thất bại hoặc cơ hội bị bỏ lỡ khiến bạn nản lòng; hãy rút ra bài học và tận dụng những kỹ năng còn lại để bắt đầu lại.',
    FINANCE: 'Cảnh báo về sự thua lỗ hoặc thất thoát tiền bạc; hãy đối diện thực tế để bảo vệ số vốn còn lại.',
    HEALTH: 'Nỗi đau tinh thần ảnh hưởng trực tiếp đến thể chất; hãy chia sẻ và buông bỏ ký ức tiêu cực.',
    GROWTH: 'Bài học lớn nhất là sự chấp nhận và chuyển hóa nỗi đau; trân trọng hơn những gì đang có.',
    CREATIVE: 'Hãy khai thác chính nỗi buồn để đưa vào nghệ thuật; cảm xúc chân thực tạo nên tác phẩm chạm đến trái tim.',
  },
  'Six of Cups': {
    GENERAL: 'Những kỷ niệm đẹp từ quá khứ đang quay trở lại mang theo niềm vui và sự an ủi; đây là lúc tận hưởng sự thuần khiết của những niềm vui nhỏ bé.',
    LOVE: 'Sự xuất hiện của một "người cũ" hoặc tình cảm mang lại cảm giác an toàn, quen thuộc như thuở ban đầu.',
    CAREER: 'Một đồng nghiệp cũ hoặc lĩnh vực cũ có thể mang lại cơ hội bất ngờ; tận dụng các mối quan hệ tốt đẹp từ quá khứ.',
    FINANCE: 'Bạn có thể nhận được hỗ trợ tài chính từ gia đình hoặc người thân quen; tiền đến từ sự chia sẻ và lòng tốt.',
    HEALTH: 'Chú trọng chữa lành các vấn đề có căn nguyên từ thời thơ ấu; phương pháp chăm sóc đơn giản, nhẹ nhàng nhất.',
    GROWTH: 'Bài học lớn nhất là kết nối lại với "đứa trẻ bên trong" để tìm lại sự hồn nhiên.',
    CREATIVE: 'Cảm hứng đến từ hoài cổ; làm mới ý tưởng cũ bằng lăng kính hiện tại.',
  },
  'Seven of Cups': {
    GENERAL: 'Bạn đang đứng trước quá nhiều lựa chọn hấp dẫn nhưng phần lớn chỉ là ảo ảnh; cần gạt bỏ sự mơ mộng để chọn một mục tiêu duy nhất.',
    LOVE: 'Mối quan hệ bị bao phủ bởi sự lý tưởng hóa quá mức; hãy phân biệt giữa tình yêu thực và hình mẫu tự vẽ ra.',
    CAREER: 'Nhiều ý tưởng nhưng thiếu tập trung; cảnh giác với "đứng núi này trông núi nọ".',
    FINANCE: 'Cảnh báo về bẫy "làm giàu nhanh"; kiểm tra kỹ con số thực tế thay vì tin viễn cảnh màu hồng.',
    HEALTH: 'Tâm trí bị phân tán; tập trung vào hoạt động "nối đất" (grounding) để lấy lại minh mẫn.',
    GROWTH: 'Bài học phân biệt giữa ước mơ và ảo tưởng; đối diện sự thật thay vì đắm chìm trong "lâu đài trên cát".',
    CREATIVE: 'Giai đoạn brainstorming tốt nhưng dễ "loạn"; cần quy trình chọn lọc khắt khe.',
  },
  'Eight of Cups': {
    GENERAL: 'Bạn đang chủ động rời bỏ một tình huống không còn mang lại sự thỏa mãn; đây là sự ra đi tự nguyện để tìm mục đích sống có ý nghĩa hơn.',
    LOVE: 'Quyết định rời bỏ mối quan hệ đã cạn kiệt năng lượng; bạn chọn bước đi để bảo vệ sự bình yên và tự trọng.',
    CAREER: 'Cân nhắc từ bỏ vị trí công việc ổn định vì không còn phù hợp với đam mê; sẵn sàng cho hành trình mới.',
    FINANCE: 'Quyết định cắt lỗ hoặc từ bỏ mục tiêu tài chính không còn mang lại giá trị; ưu tiên sự an tâm.',
    HEALTH: 'Cơ thể và tâm trí cần rời xa nguồn cơn gây căng thẳng; thay đổi không gian sống là cần thiết.',
    GROWTH: 'Bài học về sự buông bỏ để nhường chỗ cho trưởng thành tâm linh.',
    CREATIVE: 'Tạm gác phong cách sáng tạo cũ để tìm kiếm nguồn cảm hứng mới sâu sắc hơn.',
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
