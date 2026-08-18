Structured Visual Agent에서 시작 블록을 ‘Claim ID 수집’으로 구성해줘. Claim ID가 확보되면 state.claim_id에 저장하고 다음 블록으로 넘어가도록 해줘

Claim ID로 claims 데이터셋에서 해당 레코드 1건을 조회하는 Agent Tool을 만들고, Structured Agent의 다음 블록에서 그 도구를 호출해 결과를 state.claim_data에 저장해줘

state.claim_data에서 claimant/policy/금액/사고일/설명/documents_json 등을 state의 개별 키로 전개하는 블록을 추가해줘

documents_json을 파싱해서 문서 단위로 반복 처리하는 FOR_EACH 블록을 만들고, 반복 처리 결과가 scratchpad.document_analysis에 누적되도록 구성해줘

FOR_EACH 안에서 문서 1개를 입력받아 핵심 요약/누락/불일치/리스크를 짧게 생성하는 블록을 추가해줘. 결과는 반복이 끝난 뒤 종합 판단에서 활용 가능해야 해

클레임 정보(state)와 문서 분석 결과(scratchpad)를 종합해서 state.decision을 APPROVE/REQUEST_INFO/ESCALATE 중 하나로만 생성하고, state.decision_rationale도 함께 생성하도록 블록을 추가해줘

state.decision 값에 따라 승인/추가정보요청/에스컬레이션 중 하나의 문서 생성 블록으로 라우팅되는 ROUTING 블록을 추가해줘

APPROVE/REQUEST_INFO/ESCALATE 각각에 대해 Markdown 산출물을 생성하는 GENERATE_ARTIFACT 블록을 추가해줘. 각 문서에는 Claim ID, 사고일, 금액, 결정 근거가 포함되게 해줘
